package ch.rasc.googlevision;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.BucketInfo;
import com.google.cloud.storage.Cors;
import com.google.cloud.storage.Cors.Origin;
import com.google.cloud.storage.HttpMethod;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.Storage.SignUrlOption;
import com.google.cloud.storage.StorageOptions;
import com.google.cloud.vision.v1.AnnotateImageRequest;
import com.google.cloud.vision.v1.AnnotateImageResponse;
import com.google.cloud.vision.v1.BatchAnnotateImagesResponse;
import com.google.cloud.vision.v1.EntityAnnotation;
import com.google.cloud.vision.v1.FaceAnnotation;
import com.google.cloud.vision.v1.Feature;
import com.google.cloud.vision.v1.Feature.Type;
import com.google.cloud.vision.v1.Image;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.cloud.vision.v1.ImageAnnotatorSettings;
import com.google.cloud.vision.v1.ImageSource;
import com.google.cloud.vision.v1.Likelihood;
import com.google.cloud.vision.v1.SafeSearchAnnotation;
import com.google.cloud.vision.v1.WebDetection;
import com.google.cloud.vision.v1.WebDetection.WebImage;
import com.google.cloud.vision.v1.WebDetection.WebPage;

import ch.rasc.googlevision.dto.Face;
import ch.rasc.googlevision.dto.FaceLandmark;
import ch.rasc.googlevision.dto.Label;
import ch.rasc.googlevision.dto.Landmark;
import ch.rasc.googlevision.dto.LngLat;
import ch.rasc.googlevision.dto.Logo;
import ch.rasc.googlevision.dto.SafeSearch;
import ch.rasc.googlevision.dto.Text;
import ch.rasc.googlevision.dto.Vertex;
import ch.rasc.googlevision.dto.VisionResult;
import ch.rasc.googlevision.dto.Web;
import ch.rasc.googlevision.dto.WebEntity;
import ch.rasc.googlevision.dto.WebUrl;

@RestController
@CrossOrigin
public class VisionController {

  private static final String BUCKET_NAME = "rasc_visiondemo_2020";
  private Storage storage;
  private ImageAnnotatorSettings imageAnnotatorSettings;

  public VisionController(AppConfig appConfig) {
    Path serviceAccountFile = Paths.get(appConfig.getServiceAccountFile());

    try (InputStream is = Files.newInputStream(serviceAccountFile)) {
      GoogleCredentials credentials = GoogleCredentials.fromStream(is);
      StorageOptions options = StorageOptions.newBuilder().setCredentials(credentials)
          .build();
      this.storage = options.getService();

      Bucket bucket = this.storage.get(BUCKET_NAME);
      if (bucket == null) {

        Cors cors = Cors.newBuilder().setMaxAgeSeconds(3600)
            .setMethods(Collections.singleton(HttpMethod.PUT))
            .setOrigins(appConfig.getOrigins().stream().map(Origin::of)
                .collect(Collectors.toList()))
            .setResponseHeaders(
                Arrays.asList("Content-Type", "Access-Control-Allow-Origin"))
            .build();

        this.storage.create(BucketInfo.newBuilder(BUCKET_NAME)
            .setCors(Collections.singleton(cors)).build());
      }

      this.imageAnnotatorSettings = ImageAnnotatorSettings.newBuilder()
          .setCredentialsProvider(FixedCredentialsProvider.create(credentials)).build();

    }
    catch (IOException e) {
      LoggerFactory.getLogger(VisionController.class)
          .error("error constructing VisionController", e);
    }
  }

  @PostMapping("/signurl")
  public SignUrlResponse getSignUrl(@RequestParam("contentType") String contentType) {
    String uuid = UUID.randomUUID().toString();
    String url = this.storage.signUrl(
        BlobInfo.newBuilder(BUCKET_NAME, uuid).setContentType(contentType).build(), 3,
        TimeUnit.MINUTES, SignUrlOption.httpMethod(HttpMethod.PUT),
        SignUrlOption.withContentType()).toString();
    return new SignUrlResponse(uuid, url);
  }

  @PostMapping("/vision")
  public VisionResult vision(@RequestParam("uuid") String uuid) throws IOException {

    try (ImageAnnotatorClient vision = ImageAnnotatorClient
        .create(this.imageAnnotatorSettings)) {

      Image img = Image.newBuilder()
          .setSource(
              ImageSource.newBuilder().setImageUri("gs://" + BUCKET_NAME + "/" + uuid))
          .build();

      AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
          .addFeatures(Feature.newBuilder().setType(Type.FACE_DETECTION).build())
          .addFeatures(Feature.newBuilder().setType(Type.LANDMARK_DETECTION).build())
          .addFeatures(Feature.newBuilder().setType(Type.LOGO_DETECTION).build())
          .addFeatures(Feature.newBuilder().setType(Type.LABEL_DETECTION)
              .setMaxResults(20).build())
          .addFeatures(Feature.newBuilder().setType(Type.TEXT_DETECTION).build())
          .addFeatures(Feature.newBuilder().setType(Type.SAFE_SEARCH_DETECTION).build())
          .addFeatures(
              Feature.newBuilder().setType(Type.WEB_DETECTION).setMaxResults(10).build())
          .setImage(img).build();

      // More Features:
      // DOCUMENT_TEXT_DETECTION
      // IMAGE_PROPERTIES
      // CROP_HINTS
      // PRODUCT_SEARCH
      // OBJECT_LOCALIZATION

      List<AnnotateImageRequest> requests = new ArrayList<>();
      requests.add(request);

      // Performs label detection on the image file
      BatchAnnotateImagesResponse response = vision.batchAnnotateImages(requests);
      List<AnnotateImageResponse> responses = response.getResponsesList();

      VisionResult result = new VisionResult();
      AnnotateImageResponse resp = responses.get(0);

      if (resp.hasError()) {
        result.setError(resp.getError().getMessage());
        return result;
      }

      if (resp.getLabelAnnotationsList() != null) {
        List<Label> labels = new ArrayList<>();
        for (EntityAnnotation ea : resp.getLabelAnnotationsList()) {
          Label l = new Label();
          l.setScore(ea.getScore());
          l.setDescription(ea.getDescription());
          labels.add(l);
        }
        result.setLabels(labels);
      }

      if (resp.getLandmarkAnnotationsList() != null) {
        List<Landmark> landmarks = new ArrayList<>();
        for (EntityAnnotation ea : resp.getLandmarkAnnotationsList()) {
          Landmark l = new Landmark();
          l.setScore(ea.getScore());
          l.setDescription(ea.getDescription());

          if (ea.getBoundingPoly() != null) {
            l.setBoundingPoly(ea.getBoundingPoly().getVerticesList().stream().map(v -> {
              Vertex vertex = new Vertex();
              vertex.setX(v.getX());
              vertex.setY(v.getY());
              return vertex;
            }).collect(Collectors.toList()));
          }
          if (ea.getLocationsList() != null) {
            l.setLocations(ea.getLocationsList().stream().map(loc -> {
              LngLat ll = new LngLat();
              ll.setLng(loc.getLatLng().getLongitude());
              ll.setLat(loc.getLatLng().getLatitude());
              return ll;
            }).collect(Collectors.toList()));
          }
          landmarks.add(l);
        }
        result.setLandmarks(landmarks);
      }

      if (resp.getLogoAnnotationsList() != null) {
        List<Logo> logos = new ArrayList<>();
        for (EntityAnnotation ea : resp.getLogoAnnotationsList()) {
          Logo l = new Logo();
          l.setScore(ea.getScore());
          l.setDescription(ea.getDescription());

          if (ea.getBoundingPoly() != null) {
            l.setBoundingPoly(ea.getBoundingPoly().getVerticesList().stream().map(v -> {
              Vertex vertex = new Vertex();
              vertex.setX(v.getX());
              vertex.setY(v.getY());
              return vertex;
            }).collect(Collectors.toList()));
          }
          logos.add(l);
        }
        result.setLogos(logos);
      }

      if (resp.getTextAnnotationsList() != null) {
        Set<Text> texts = new HashSet<>();
        for (EntityAnnotation ea : resp.getTextAnnotationsList()) {
          Text t = new Text();
          t.setDescription(ea.getDescription().trim());

          if (ea.getBoundingPoly() != null) {
            t.setBoundingPoly(ea.getBoundingPoly().getVerticesList().stream()
                .filter(Objects::nonNull).map(v -> {
                  Vertex vertex = new Vertex();
                  vertex.setX(v.getX());
                  vertex.setY(v.getY());
                  return vertex;
                }).collect(Collectors.toList()));
          }

          texts.add(t);
        }
        result.setTexts(texts);
      }

      if (resp.getFaceAnnotationsList() != null) {
        List<Face> faces = new ArrayList<>();
        for (FaceAnnotation fa : resp.getFaceAnnotationsList()) {
          Face face = new Face();
          face.setRollAngle(fa.getRollAngle());
          face.setPanAngle(fa.getPanAngle());
          face.setTiltAngle(fa.getTiltAngle());
          face.setDetectionConfidence(fa.getDetectionConfidence());
          face.setLandmarkingConfidence(fa.getLandmarkingConfidence());

          face.setJoy(fa.getJoyLikelihood());
          face.setJoyRating(likelihoodToNumber(fa.getJoyLikelihood()));

          face.setSorrow(fa.getSorrowLikelihood());
          face.setSorrowRating(likelihoodToNumber(fa.getSorrowLikelihood()));

          face.setAnger(fa.getAngerLikelihood());
          face.setAngerRating(likelihoodToNumber(fa.getAngerLikelihood()));

          face.setSurprise(fa.getSurpriseLikelihood());
          face.setSurpriseRating(likelihoodToNumber(fa.getSurpriseLikelihood()));

          face.setUnderExposed(fa.getUnderExposedLikelihood());
          face.setUnderExposedRating(likelihoodToNumber(fa.getUnderExposedLikelihood()));

          face.setBlurred(fa.getBlurredLikelihood());
          face.setBlurredRating(likelihoodToNumber(fa.getBlurredLikelihood()));

          face.setHeadwear(fa.getHeadwearLikelihood());
          face.setHeadwearRating(likelihoodToNumber(fa.getHeadwearLikelihood()));

          if (fa.getBoundingPoly() != null) {
            face.setBoundingPoly(
                fa.getBoundingPoly().getVerticesList().stream().map(v -> {
                  Vertex vertex = new Vertex();
                  vertex.setX(v.getX());
                  vertex.setY(v.getY());
                  return vertex;
                }).collect(Collectors.toList()));
          }

          if (fa.getFdBoundingPoly() != null) {
            face.setFdBoundingPoly(
                fa.getFdBoundingPoly().getVerticesList().stream().map(v -> {
                  Vertex vertex = new Vertex();
                  vertex.setX(v.getX());
                  vertex.setY(v.getY());
                  return vertex;
                }).collect(Collectors.toList()));
          }

          if (fa.getLandmarksList() != null) {
            face.setLandmarks(fa.getLandmarksList().stream().map(l -> {
              FaceLandmark fl = new FaceLandmark();
              fl.setType(l.getType());
              fl.setX(l.getPosition().getX());
              fl.setY(l.getPosition().getY());
              fl.setZ(l.getPosition().getZ());
              return fl;
            }).collect(Collectors.toList()));
          }

          faces.add(face);
        }
        result.setFaces(faces);
      }

      SafeSearchAnnotation safeSearchAnnotation = resp.getSafeSearchAnnotation();
      if (safeSearchAnnotation != null) {
        SafeSearch safeSearch = new SafeSearch();
        safeSearch.setAdult(safeSearchAnnotation.getAdult());
        safeSearch.setAdultRating(likelihoodToNumber(safeSearchAnnotation.getAdult()));
        safeSearch.setMedical(safeSearchAnnotation.getMedical());
        safeSearch
            .setMedicalRating(likelihoodToNumber(safeSearchAnnotation.getMedical()));
        safeSearch.setSpoof(safeSearchAnnotation.getSpoof());
        safeSearch.setSpoofRating(likelihoodToNumber(safeSearchAnnotation.getSpoof()));
        safeSearch.setViolence(safeSearchAnnotation.getViolence());
        safeSearch
            .setViolenceRating(likelihoodToNumber(safeSearchAnnotation.getViolence()));

        result.setSafeSearch(safeSearch);
      }

      WebDetection webDetection = resp.getWebDetection();
      if (webDetection != null) {
        Web web = new Web();
        List<WebImage> fullMatchingImagesList = webDetection.getFullMatchingImagesList();
        List<WebPage> pagesWithMatchingImagesList = webDetection
            .getPagesWithMatchingImagesList();
        List<WebImage> partialMatchingImagesList = webDetection
            .getPartialMatchingImagesList();
        List<com.google.cloud.vision.v1.WebDetection.WebEntity> webEntitiesList = webDetection
            .getWebEntitiesList();

        if (fullMatchingImagesList != null) {
          web.setFullMatchingImages(fullMatchingImagesList.stream().map(e -> {
            WebUrl wu = new WebUrl();
            wu.setScore(e.getScore());
            wu.setUrl(e.getUrl());
            return wu;
          }).collect(Collectors.toList()));
        }

        if (pagesWithMatchingImagesList != null) {
          web.setPagesWithMatchingImages(pagesWithMatchingImagesList.stream().map(e -> {
            WebUrl wu = new WebUrl();
            wu.setScore(e.getScore());
            wu.setUrl(e.getUrl());
            return wu;
          }).collect(Collectors.toList()));
        }

        if (partialMatchingImagesList != null) {
          web.setPartialMatchingImages(partialMatchingImagesList.stream().map(e -> {
            WebUrl wu = new WebUrl();
            wu.setScore(e.getScore());
            wu.setUrl(e.getUrl());
            return wu;
          }).collect(Collectors.toList()));
        }

        if (webEntitiesList != null) {
          web.setWebEntities(webEntitiesList.stream().map(e -> {
            if (StringUtils.hasText(e.getDescription())) {
              WebEntity we = new WebEntity();
              we.setDescription(e.getDescription());
              we.setEntityId(e.getEntityId());
              we.setScore(e.getScore());
              return we;
            }
            return null;
          }).filter(Objects::nonNull).collect(Collectors.toList()));
        }

        result.setWeb(web);
      }

      return result;
    }
    finally {
      this.storage.delete(BlobId.of(BUCKET_NAME, uuid));
    }
  }

  private static float likelihoodToNumber(Likelihood likelihood) {
    return switch (likelihood) {
    case UNKNOWN -> 0f;
    case VERY_UNLIKELY -> 0.2f;
    case UNLIKELY -> 0.4f;
    case POSSIBLE -> 0.6f;
    case LIKELY -> 0.8f;
    case VERY_LIKELY -> 1f;
    case UNRECOGNIZED -> 0f;
    default -> 0f;
    };
  }

}
