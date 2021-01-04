package ch.rasc.minio;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.UploadObjectArgs;
import io.minio.errors.MinioException;

public class Minio {

  public static void main(String[] args)
      throws InvalidKeyException, NoSuchAlgorithmException, IOException {
    try {
      String accessKey = "EY9QX8JV680F69KF1RZJ";
      String secretKey = "eobizOIujzVW5+y4Z6oYP2OsTAgmpf4imzWfeTby";

      MinioClient minioClient = MinioClient.builder().endpoint("http://127.0.0.1:9000")
          .credentials(accessKey, secretKey).build();

      boolean isExist = minioClient
          .bucketExists(BucketExistsArgs.builder().bucket("cats").build());
      if (isExist) {
        System.out.println("Bucket already exists.");
      }
      else {
        minioClient.makeBucket(MakeBucketArgs.builder().bucket("cats").build());
      }

      minioClient.listBuckets().forEach(b -> System.out.println(b.name()));

      URL url = new URL(
          "https://64.media.tumblr.com/5e714e960546f510d2b8aa5547a2f307/ae970ff79148e082-5c/s1280x1920/ec309af12b3d2af2b8804bec90df94cb7fbd576d.jpg");
      Path tempFile = Files.createTempFile("cat", ".jpg");
      try (InputStream in = url.openStream()) {
        Files.copy(in, tempFile, StandardCopyOption.REPLACE_EXISTING);
      }

      UploadObjectArgs.Builder builder = UploadObjectArgs.builder().bucket("cats")
          .object("cat.jpg").filename(tempFile.toString());
      minioClient.uploadObject(builder.build());

      Files.delete(tempFile);
    }
    catch (MinioException e) {
      System.out.println("Error occurred: " + e);
    }

  }

}
