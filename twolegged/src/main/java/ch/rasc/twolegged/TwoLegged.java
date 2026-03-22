package ch.rasc.twolegged;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator.Builder;
import com.auth0.jwt.algorithms.Algorithm;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.Base64;

public class TwoLegged {

  public static void main(String[] args)
      throws NoSuchAlgorithmException, InvalidKeySpecException, IOException,
      InterruptedException {

    Path credentialPath = resolveCredentialPath(args);
    ObjectMapper om = new ObjectMapper();

    Credentials credentials = om.readValue(Files.readAllBytes(credentialPath),
        Credentials.class);

    String privateKey = credentials.getPrivateKey().replace("\n", "")
        .replace("-----BEGIN PRIVATE KEY-----", "")
        .replace("-----END PRIVATE KEY-----", "");

    byte[] decoded = Base64.getDecoder().decode(privateKey);
    KeyFactory kf = KeyFactory.getInstance("RSA");
    PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decoded);
    RSAPrivateKey privKey = (RSAPrivateKey) kf.generatePrivate(keySpec);

    Instant now = Instant.now();
    Algorithm algorithm = Algorithm.RSA256(null, privKey);
    Builder jwtBuilder = JWT.create()
        .withIssuer(credentials.getClientEmail())
        .withAudience(credentials.getTokenUri())
        .withClaim("scope", "https://www.googleapis.com/auth/cloud-translation")
        .withExpiresAt(now.plus(1, ChronoUnit.HOURS))
        .withIssuedAt(now);
    if (credentials.getPrivateKeyId() != null && !credentials.getPrivateKeyId().isBlank()) {
      jwtBuilder.withKeyId(credentials.getPrivateKeyId());
    }
    String compactedJWT = jwtBuilder.sign(algorithm);

    HttpClient client = HttpClient.newHttpClient();

    // Token Request
    String formBody = "grant_type="
        + urlEncode("urn:ietf:params:oauth:grant-type:jwt-bearer") + "&assertion="
        + urlEncode(compactedJWT);
    HttpRequest request = HttpRequest.newBuilder(URI.create(credentials.getTokenUri()))
        .header("Content-Type", "application/x-www-form-urlencoded")
        .POST(HttpRequest.BodyPublishers.ofString(formBody)).build();

    byte[] response = sendRequest(client, request);
    TokenResponse tokenResponse = om.readValue(response, TokenResponse.class);
    System.out.println(tokenResponse);

    // Translation Request
    String translationUrl = "https://translate.googleapis.com/v3/projects/"
        + credentials.getProjectId() + "/locations/global:translateText";
    Map<String, Object> translationRequest = Map.of("contents", List.of("Hello world"),
        "mimeType", "text/plain", "sourceLanguageCode", "en",
        "targetLanguageCode", "fr");

    request = HttpRequest.newBuilder(URI.create(translationUrl))
        .header("Authorization", "Bearer " + tokenResponse.getAccessToken())
        .header("Content-Type", "application/json; charset=utf-8")
        .POST(HttpRequest.BodyPublishers
            .ofByteArray(om.writeValueAsBytes(translationRequest)))
        .build();

    response = sendRequest(client, request);
    JsonNode obj = om.readValue(response, JsonNode.class);

    JsonNode translations = obj.path("translations");
    String translatedText = translations.isArray() && !translations.isEmpty()
      ? translations.get(0).path("translatedText").asString() : null;

    System.out.println(translatedText);

  }

  private static Path resolveCredentialPath(String[] args) {
    if (args.length > 0 && !args[0].isBlank()) {
      return Path.of(args[0]);
    }

    String environmentPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
    if (environmentPath != null && !environmentPath.isBlank()) {
      return Path.of(environmentPath);
    }

    throw new IllegalArgumentException(
        "Provide the service account JSON path as the first argument or set GOOGLE_APPLICATION_CREDENTIALS");
  }

  private static byte[] sendRequest(HttpClient client, HttpRequest request)
      throws IOException, InterruptedException {
    HttpResponse<byte[]> response = client.send(request,
        HttpResponse.BodyHandlers.ofByteArray());
    if (response.statusCode() >= 200 && response.statusCode() < 300) {
      return response.body();
    }

    throw new IOException("Request failed with status " + response.statusCode() + ": "
        + new String(response.body(), StandardCharsets.UTF_8));
  }

  private static String urlEncode(String value) {
    return URLEncoder.encode(value, StandardCharsets.UTF_8);
  }

}
