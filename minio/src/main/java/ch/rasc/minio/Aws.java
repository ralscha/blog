package ch.rasc.minio;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;

import com.amazonaws.ClientConfiguration;
import com.amazonaws.Protocol;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.Bucket;

public class Aws {
  public static void main(String[] args) throws IOException {
    String accessKey = "EY9QX8JV680F69KF1RZJ";
    String secretKey = "eobizOIujzVW5+y4Z6oYP2OsTAgmpf4imzWfeTby";

    AWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);

    ClientConfiguration clientConfig = new ClientConfiguration();
    clientConfig.setProtocol(Protocol.HTTP);

    EndpointConfiguration endpointConfiguration = new EndpointConfiguration(
        "http://127.0.0.1:9000", "us-east-1");

    AmazonS3 client = AmazonS3ClientBuilder.standard()
        .withCredentials(new AWSStaticCredentialsProvider(credentials))
        .withClientConfiguration(clientConfig)
        .withEndpointConfiguration(endpointConfiguration).build();

    boolean isExist = client.doesBucketExistV2("cataws");
    if (isExist) {
      System.out.println("Bucket already exists.");
    }
    else {
      client.createBucket("cataws");
    }

    List<Bucket> buckets = client.listBuckets();
    buckets.forEach(b -> System.out.println(b.getName()));

    URL url = new URL(
        "https://64.media.tumblr.com/5e714e960546f510d2b8aa5547a2f307/ae970ff79148e082-5c/s1280x1920/ec309af12b3d2af2b8804bec90df94cb7fbd576d.jpg");
    Path tempFile = Files.createTempFile("cat", ".jpg");
    try (InputStream in = url.openStream()) {
      Files.copy(in, tempFile, StandardCopyOption.REPLACE_EXISTING);
    }
    client.putObject("cataws", "cat.jpg", tempFile.toFile());
    Files.delete(tempFile);

  }
}
