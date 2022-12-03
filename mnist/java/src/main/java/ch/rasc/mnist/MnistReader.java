package ch.rasc.mnist;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.GZIPInputStream;

public class MnistReader {
  public static int[] getLabels(Path labelsFile) throws IOException {
    ByteBuffer bb = ByteBuffer.wrap(decompress(Files.readAllBytes(labelsFile)));
    if (bb.getInt() != 2049) {
      throw new IOException("not a labels file");
    }

    int numLabels = bb.getInt();
    int[] labels = new int[numLabels];

    for (int i = 0; i < numLabels; i++) {
      labels[i] = bb.get() & 0xFF;
    }
    return labels;
  }

  public static List<int[][]> getImages(Path imagesFile) throws IOException {
    ByteBuffer bb = ByteBuffer.wrap(decompress(Files.readAllBytes(imagesFile)));
    if (bb.getInt() != 2051) {
      throw new IOException("not an images file");
    }

    int numImages = bb.getInt();
    int numRows = bb.getInt();
    int numColumns = bb.getInt();
    List<int[][]> images = new ArrayList<>();

    for (int i = 0; i < numImages; i++) {
      int[][] image = new int[numRows][];
      for (int row = 0; row < numRows; row++) {
        image[row] = new int[numColumns];
        for (int col = 0; col < numColumns; ++col) {
          image[row][col] = bb.get() & 0xFF;
        }
      }
      images.add(image);
    }

    return images;
  }

  private static byte[] decompress(final byte[] input) throws IOException {
    try (ByteArrayInputStream bais = new ByteArrayInputStream(input);
        GZIPInputStream gis = new GZIPInputStream(bais);
        ByteArrayOutputStream out = new ByteArrayOutputStream()) {
      byte[] buf = new byte[8192];
      int n;
      while ((n = gis.read(buf)) > 0) {
        out.write(buf, 0, n);

      }
      return out.toByteArray();
    }
  }

  public static String renderImage(int[][] image) {
    StringBuilder sb = new StringBuilder();
    int threshold1 = 256 / 3;
    int threshold2 = 2 * threshold1;

    for (int[] element : image) {
      sb.append("|");
      for (int pixelVal : element) {
        if (pixelVal == 0) {
          sb.append(" ");
        }
        else if (pixelVal < threshold1) {
          sb.append(".");
        }
        else {
          if (pixelVal < threshold2) {
            sb.append("x");
          }
          else {
            sb.append("X");
          }
        }
      }
      sb.append("|\n");
    }

    return sb.toString();
  }

}