package ch.rasc.twolegged;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.Translate.TranslateOption;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;

public class GoogleLib {

  public static void main(String[] args) throws IOException {
    Path credentialPath = Paths.get("./translationdemo-5674749bc948.json");
    ServiceAccountCredentials credentials = ServiceAccountCredentials
        .fromStream(Files.newInputStream(credentialPath));

    Translate translate = TranslateOptions.newBuilder().setCredentials(credentials)
        .build().getService();

    Translation translation = translate.translate("Hello World",
        TranslateOption.sourceLanguage("en"), TranslateOption.targetLanguage("fr"));

    System.out.println(translation.getTranslatedText());

  }
}
