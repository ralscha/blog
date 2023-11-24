package ch.rasc.minio;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
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
      String accessKey = "minioadmin";
      String secretKey = "minioadmin";

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

      URL url = URI.create(
          "https://preview.redd.it/7i4g79z1ih071.jpg?width=640&crop=smart&auto=webp&s=139c4dc2c873d538316519031dc7c8ea8bd86c36").toURL();
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
