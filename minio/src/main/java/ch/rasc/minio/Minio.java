package ch.rasc.minio;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import org.xmlpull.v1.XmlPullParserException;

import io.minio.MinioClient;
import io.minio.errors.MinioException;

public class Minio {

  public static void main(String[] args) throws InvalidKeyException,
      NoSuchAlgorithmException, IOException, XmlPullParserException {
    try {
      String accessKey = "EDVBGO8GKEY0BXMXQYXV";
      String secretKey = "VSomZpBJ7WluGXPPsRxCxFhLnq3yOu9m+pAaCzYt";

      MinioClient minioClient = new MinioClient("http://192.168.178.84:9000", accessKey,
          secretKey);

      boolean isExist = minioClient.bucketExists("cats");
      if (isExist) {
        System.out.println("Bucket already exists.");
      }
      else {
        minioClient.makeBucket("cats");
      }

      minioClient.listBuckets().forEach(b -> System.out.println(b.name()));

      URL url = new URL(
          "http://writm.com/wp-content/uploads/2016/08/Cat-hd-wallpapers.jpg");
      Path tempFile = Files.createTempFile("cat", ".jpg");
      try (InputStream in = url.openStream()) {
        Files.copy(in, tempFile, StandardCopyOption.REPLACE_EXISTING);
      }

      minioClient.putObject("cats", "cat.jpg", tempFile.toString());
      Files.delete(tempFile);
    }
    catch (MinioException e) {
      System.out.println("Error occurred: " + e);
    }

  }

}
