package ch.rasc.minio;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
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
    String accessKey = "minioadmin";
    String secretKey = "minioadmin";

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

    URL url = URI.create(
        "https://preview.redd.it/7i4g79z1ih071.jpg?width=640&crop=smart&auto=webp&s=139c4dc2c873d538316519031dc7c8ea8bd86c36").toURL();
    Path tempFile = Files.createTempFile("cat", ".jpg");
    try (InputStream in = url.openStream()) {
      Files.copy(in, tempFile, StandardCopyOption.REPLACE_EXISTING);
    }
    client.putObject("cataws", "cat.jpg", tempFile.toFile());
    Files.delete(tempFile);

  }
}
