package ch.rasc.upload;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.minio.BucketExistsArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;
import io.minio.http.Method;

@RestController
public class PreSignController {
  private final static String BUCKET_NAME = "uploads";

  private final MinioClient minioClient;

  public PreSignController(MinioClient minioClient) {
    this.minioClient = minioClient;
  }

  @PostConstruct
  public void createBucket() throws InvalidKeyException, NoSuchAlgorithmException,
      InsufficientDataException, ErrorResponseException, InternalException, IOException,
      InvalidResponseException, IllegalArgumentException, XmlParserException, ServerException {

    if (!this.minioClient
        .bucketExists(BucketExistsArgs.builder().bucket(BUCKET_NAME).build())) {
      this.minioClient.makeBucket(MakeBucketArgs.builder().bucket(BUCKET_NAME).build());
    }

  }

  @CrossOrigin
  @GetMapping("/getPreSignUrl")
  public String getPreSignUrl(@RequestParam("fileName") String fileName)
      throws InvalidKeyException, NoSuchAlgorithmException, InsufficientDataException,
      ErrorResponseException, InternalException, IOException, InvalidResponseException,
      IllegalArgumentException, XmlParserException, ServerException {

    return this.minioClient.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
        .method(Method.PUT).bucket(BUCKET_NAME).expiry(1, TimeUnit.HOURS).build());

  }
}
