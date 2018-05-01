package ch.rasc.twolegged;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.bridge.SLF4JBridgeHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import okhttp3.FormBody;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;
import okhttp3.logging.HttpLoggingInterceptor;
import okhttp3.logging.HttpLoggingInterceptor.Level;

public class TwoLegged {

  public static void main(String[] args)
      throws NoSuchAlgorithmException, InvalidKeySpecException, IOException {

    // https://developers.google.com/identity/protocols/OAuth2ServiceAccount
    SLF4JBridgeHandler.removeHandlersForRootLogger();
    SLF4JBridgeHandler.install();

    Path credentialPath = Paths.get("./translationdemo-5674749bc948.json");
    ObjectMapper om = new ObjectMapper();

    Credentials credentials = om.readValue(Files.readAllBytes(credentialPath),
        Credentials.class);

    String privateKey = credentials.getPrivateKey();
    privateKey = privateKey.replace("\n", "");
    privateKey = privateKey.replace("-----BEGIN PRIVATE KEY-----", "");
    privateKey = privateKey.replace("-----END PRIVATE KEY-----", "");

    byte[] decoded = Base64.getDecoder().decode(privateKey);
    KeyFactory kf = KeyFactory.getInstance("RSA");
    PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decoded);
    RSAPrivateKey privKey = (RSAPrivateKey) kf.generatePrivate(keySpec);

    String compactedJWT = Jwts.builder().setIssuer(credentials.getClientEmail())
        .setAudience(credentials.getTokenUri())
        .claim("scope", "https://www.googleapis.com/auth/cloud-translation")
        .setExpiration(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)))
        .setIssuedAt(Date.from(Instant.now())).signWith(SignatureAlgorithm.RS256, privKey)
        .compact();

    HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
    logging.setLevel(Level.BODY);
    OkHttpClient client = new OkHttpClient.Builder().addInterceptor(logging).build();

    // Token Request
    RequestBody formBody = new FormBody.Builder()
        .add("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer")
        .add("assertion", compactedJWT).build();
    Request request = new Request.Builder().url(credentials.getTokenUri()).post(formBody)
        .build();

    byte[] response = sendRequest(client, request);
    TokenResponse tokenResponse = om.readValue(response, TokenResponse.class);
    System.out.println(tokenResponse);

    // Translation Request
    MediaType JSON = MediaType.parse("application/json; charset=utf-8");

    String translationUrl = "https://translation.googleapis.com/language/translate/v2";
    Map<String, String> tr = new HashMap<>();
    tr.put("q", "Hello world");
    tr.put("target", "fr");
    tr.put("source", "en");

    RequestBody requestBody = RequestBody.create(JSON, om.writeValueAsBytes(tr));
    request = new Request.Builder().url(translationUrl)
        .header("Authorization", "Bearer " + tokenResponse.getAccessToken())
        .post(requestBody).build();

    response = sendRequest(client, request);
    JsonNode obj = om.readValue(response, JsonNode.class);

    String translatedText = null;
    JsonNode data = obj.get("data");
    if (data != null) {
      JsonNode translations = data.get("translations");
      if (translations != null && translations.isArray() && translations.size() > 0) {
        translatedText = translations.get(0).get("translatedText").asText();
      }
    }

    System.out.println(translatedText);

  }

  private static byte[] sendRequest(OkHttpClient client, Request request)
      throws IOException {
    try (Response response = client.newCall(request).execute();
        ResponseBody body = response.body()) {
      if (body != null) {
        return body.bytes();
      }
      return null;
    }
  }

  /*
   * <-- 401 Unauthorized https://translation.googleapis.com/language/translate/v2 (183ms)
   * WWW-Authenticate: Bearer realm="https://accounts.google.com/", error="invalid_token"
   * Vary: Origin Vary: X-Origin Vary: Referer Content-Type: application/json;
   * charset=UTF-8 Date: Sat, 17 Mar 2018 05:09:30 GMT Server: ESF Cache-Control: private
   * X-XSS-Protection: 1; mode=block X-Frame-Options: SAMEORIGIN X-Content-Type-Options:
   * nosniff Alt-Svc: hq=":443"; ma=2592000; quic=51303431; quic=51303339;
   * quic=51303335,quic=":443"; ma=2592000; v="41,39,35" Transfer-Encoding: chunked
   *
   * { "error": { "code": 401, "message":
   * "Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project."
   * , "errors": [ { "message": "Request had invalid authentication credentials.",
   * "reason": "authError" } ], "status": "UNAUTHENTICATED" } }
   *
   * <-- END HTTP (436-byte body) null
   *
   */

}
