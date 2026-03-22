package ch.rasc.twolegged;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.translate.v3.TranslateTextRequest;
import com.google.cloud.translate.v3.TranslateTextResponse;
import com.google.cloud.translate.v3.Translation;
import com.google.cloud.translate.v3.TranslationServiceClient;
import com.google.cloud.translate.v3.TranslationServiceSettings;

public class GoogleLib {

  public static void main(String[] args) throws IOException {
    GoogleCredentials credentials = loadCredentials(args)
        .createScoped(List.of("https://www.googleapis.com/auth/cloud-translation"));
    String projectId = resolveProjectId(args, credentials);

    TranslationServiceSettings settings = TranslationServiceSettings.newBuilder()
        .setCredentialsProvider(FixedCredentialsProvider.create(credentials)).build();

    TranslateTextRequest request = TranslateTextRequest.newBuilder()
        .setParent("projects/" + projectId + "/locations/global")
        .addContents("Hello world")
        .setMimeType("text/plain")
        .setSourceLanguageCode("en")
        .setTargetLanguageCode("fr")
        .build();

    try (TranslationServiceClient client = TranslationServiceClient.create(settings)) {
      TranslateTextResponse response = client.translateText(request);
      Translation translation = response.getTranslationsList().stream().findFirst()
          .orElseThrow(() -> new IllegalStateException("No translation returned"));

      System.out.println(translation.getTranslatedText());
    }

  }

  private static GoogleCredentials loadCredentials(String[] args) throws IOException {
    if (args.length > 0 && !args[0].isBlank()) {
      Path credentialPath = Path.of(args[0]);
      try (var inputStream = Files.newInputStream(credentialPath)) {
        return GoogleCredentials.fromStream(inputStream);
      }
    }

    return GoogleCredentials.getApplicationDefault();
  }

  private static String resolveProjectId(String[] args, GoogleCredentials credentials) {
    if (args.length > 1 && !args[1].isBlank()) {
      return args[1];
    }

    String projectId = System.getenv("GOOGLE_CLOUD_PROJECT");
    if (projectId != null && !projectId.isBlank()) {
      return projectId;
    }

    if (credentials instanceof ServiceAccountCredentials serviceAccountCredentials
        && serviceAccountCredentials.getProjectId() != null
        && !serviceAccountCredentials.getProjectId().isBlank()) {
      return serviceAccountCredentials.getProjectId();
    }

    throw new IllegalArgumentException(
        "Provide the Google Cloud project ID as the second argument or set GOOGLE_CLOUD_PROJECT");
  }
}
