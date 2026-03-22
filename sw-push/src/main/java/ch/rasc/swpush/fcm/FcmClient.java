package ch.rasc.swpush.fcm;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.TopicManagementResponse;
import com.google.firebase.messaging.WebpushConfig;

import ch.rasc.swpush.FcmSettings;

@Service
public class FcmClient {

  private static final Logger logger = LoggerFactory.getLogger(FcmClient.class);

  private final FirebaseMessaging firebaseMessaging;

  public FcmClient(FcmSettings settings) {
    String serviceAccountFile = settings.getServiceAccountFile();
    if (serviceAccountFile == null || serviceAccountFile.isBlank()) {
      throw new IllegalStateException("fcm.service-account-file must be configured");
    }

    Path path = Path.of(serviceAccountFile);
    try (InputStream serviceAccount = Files.newInputStream(path)) {
      FirebaseOptions options = FirebaseOptions.builder()
          .setCredentials(GoogleCredentials.fromStream(serviceAccount)).build();

      FirebaseApp firebaseApp = FirebaseApp.getApps().isEmpty()
          ? FirebaseApp.initializeApp(options)
          : FirebaseApp.getInstance();
      this.firebaseMessaging = FirebaseMessaging.getInstance(firebaseApp);
    }
    catch (IOException e) {
      throw new IllegalStateException("Unable to initialize Firebase Admin SDK", e);
    }
  }

  public void send(Map<String, String> data) {
    try {
      Message message = Message.builder().putAllData(data).setTopic("chuck")
          .setWebpushConfig(WebpushConfig.builder().putHeader("TTL", "300").build())
          .build();

      String response = this.firebaseMessaging.send(message);
      logger.info("Sent message {}", response);
    }
    catch (Exception e) {
      logger.error("Failed to send Firebase message", e);
    }
  }

  public void subscribe(String topic, String clientToken) {
    try {
      TopicManagementResponse response = this.firebaseMessaging
          .subscribeToTopic(List.of(clientToken), topic);
      logger.info("{} tokens were subscribed successfully",
          response.getSuccessCount());
    }
    catch (Exception e) {
      logger.error("Failed to subscribe client to topic {}", topic, e);
    }
  }
}
