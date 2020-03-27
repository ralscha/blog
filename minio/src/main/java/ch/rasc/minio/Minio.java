package ch.rasc.minio;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import io.minio.MinioClient;
import io.minio.PutObjectOptions;
import io.minio.errors.MinioException;

public class Minio {

  public static void main(String[] args) throws InvalidKeyException,
      NoSuchAlgorithmException, IOException {
    try {
      String accessKey = "EY9QX8JV680F69KF1RZJ";
      String secretKey = "eobizOIujzVW5+y4Z6oYP2OsTAgmpf4imzWfeTby";

      MinioClient minioClient = new MinioClient("http://127.0.0.1:9000", accessKey,
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
          "http://www.cutestpaw.com/wp-content/uploads/2015/11/My-Cute-Baby-Cat.jpg");
      Path tempFile = Files.createTempFile("cat", ".jpg");
      try (InputStream in = url.openStream()) {
        Files.copy(in, tempFile, StandardCopyOption.REPLACE_EXISTING);
      }

      minioClient.putObject("cats", "cat.jpg", tempFile.toString(),
          new PutObjectOptions(Files.size(tempFile), -1));
      Files.delete(tempFile);
    }
    catch (MinioException e) {
      System.out.println("Error occurred: " + e);
    }

  }

}
