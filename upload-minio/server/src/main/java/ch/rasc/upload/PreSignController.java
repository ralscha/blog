package ch.rasc.upload;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.annotation.PostConstruct;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.xmlpull.v1.XmlPullParserException;

import io.minio.MinioClient;
import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidBucketNameException;
import io.minio.errors.InvalidExpiresRangeException;
import io.minio.errors.NoResponseException;
import io.minio.errors.RegionConflictException;

@RestController
public class PreSignController {
  private final static String BUCKET_NAME = "uploads";

  private final MinioClient minioClient;

  public PreSignController(MinioClient minioClient) {
    this.minioClient = minioClient;
  }

  @PostConstruct
  public void createBucket()
      throws InvalidKeyException, InvalidBucketNameException, NoSuchAlgorithmException,
      InsufficientDataException, NoResponseException, ErrorResponseException,
      InternalException, IOException, XmlPullParserException, RegionConflictException {

    if (!minioClient.bucketExists(BUCKET_NAME)) {
      minioClient.makeBucket(BUCKET_NAME);
    }

  }

  @CrossOrigin
  @GetMapping("/getPreSignUrl")
  public String getPreSignUrl(@RequestParam("fileName") String fileName)
      throws InvalidKeyException, InvalidBucketNameException, NoSuchAlgorithmException,
      InsufficientDataException, NoResponseException, ErrorResponseException,
      InternalException, InvalidExpiresRangeException, IOException,
      XmlPullParserException {

    return this.minioClient.presignedPutObject(BUCKET_NAME, fileName, 60);

  }
}
