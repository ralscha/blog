package ch.rasc.mnist;

import static org.apache.commons.math3.linear.MatrixUtils.createRealMatrix;

import java.util.Random;
import java.util.function.Function;

import org.apache.commons.math3.linear.RealMatrix;

public abstract class Util {
  private final static Random random = new Random();

  public static double[] a(double... e) {
    return e;
  }

  public static double sigmoid(double x) {
    return 1 / (1 + Math.exp(-x));
  }

  public static RealMatrix scalar(RealMatrix matrix, Function<Double, Double> function) {
    int numRows = matrix.getRowDimension();
    int numCols = matrix.getColumnDimension();
    RealMatrix result = createRealMatrix(numRows, numCols);
    for (int r = 0; r < numRows; r++) {
      for (int c = 0; c < numCols; c++) {
        result.setEntry(r, c, function.apply(matrix.getEntry(r, c)));
      }
    }
    return result;
  }

  public static RealMatrix multiplyElements(RealMatrix matrixA, RealMatrix matrixB)
      throws IllegalArgumentException {
    if (matrixA == null || matrixB == null || !areDimensionsEqual(matrixA, matrixB)) {
      throw new IllegalArgumentException("""
          Both matrices must be non-null\s\
          and matrix dimensions must be equal\
           for element-wise multiplication.""");
    }

    int numRows = matrixA.getRowDimension();
    int numCols = matrixA.getColumnDimension();
    RealMatrix product = createRealMatrix(numRows, numCols);

    for (int r = 0; r < numRows; r++) {
      for (int c = 0; c < numCols; c++) {
        product.setEntry(r, c, matrixA.getEntry(r, c) * matrixB.getEntry(r, c));
      }
    }
    return product;
  }

  private static boolean areDimensionsEqual(RealMatrix matrixA, RealMatrix matrixB) {
    return matrixA.getRowDimension() == matrixB.getRowDimension()
        && matrixA.getColumnDimension() == matrixB.getColumnDimension();
  }

  public static int[] flat(int[][] i) {
    int[] result = new int[i.length * i[0].length];
    for (int r = 0; r < i.length; r++) {
      int[] row = i[r];
      System.arraycopy(row, 0, result, r * row.length, row.length);
    }
    return result;
  }

  public static RealMatrix initRandom(RealMatrix matrix,
      double desiredStandardDeviation) {
    return scalar(matrix, in -> random.nextGaussian() * desiredStandardDeviation);
  }

}
