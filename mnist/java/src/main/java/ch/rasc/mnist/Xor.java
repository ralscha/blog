package ch.rasc.mnist;

import static ch.rasc.mnist.Util.a;
import static ch.rasc.mnist.Util.initRandom;
import static ch.rasc.mnist.Util.multiplyElements;
import static ch.rasc.mnist.Util.scalar;
import static org.apache.commons.math3.linear.MatrixUtils.createRealMatrix;
import static org.apache.commons.math3.linear.MatrixUtils.createRowRealMatrix;

import org.apache.commons.math3.linear.MatrixUtils;
import org.apache.commons.math3.linear.RealMatrix;

public class Xor {

	private final static int inodes = 2;
	private final static int hnodes = 4;
	private final static int onodes = 1;
	private final static double learning_rate = 0.3;

	private static RealMatrix wInputHidden;
	private static RealMatrix wHiddenOutput;

	public static void main(String[] args) {

		wInputHidden = createRealMatrix(hnodes, inodes);
		wHiddenOutput = createRealMatrix(onodes, hnodes);
		wInputHidden = initRandom(wInputHidden, Math.pow(inodes, -0.5));
		wHiddenOutput = initRandom(wHiddenOutput, Math.pow(hnodes, -0.5));

		for (int i = 0; i < 10_000; i++) {
			train(createRealMatrix(new double[][] { a(0.01, 0.01, 0.99, 0.99),
					a(0.01, 0.99, 0.01, 0.99) }),
					createRowRealMatrix(a(0.01, 0.99, 0.99, 0.01)));
		}

		System.out.println(query(a(0.01, 0.01)));
		System.out.println(query(a(0.01, 0.99)));
		System.out.println(query(a(0.99, 0.01)));
		System.out.println(query(a(0.99, 0.99)));

	}

	private static RealMatrix query(double[] inputArray) {
		RealMatrix inputs = MatrixUtils.createColumnRealMatrix(inputArray);
		RealMatrix hiddenInputs = wInputHidden.multiply(inputs);
		RealMatrix hiddenOutputs = scalar(hiddenInputs, Util::sigmoid);

		RealMatrix finalInputs = wHiddenOutput.multiply(hiddenOutputs);
		RealMatrix finalOutputs = scalar(finalInputs, Util::sigmoid);
		return finalOutputs;
	}

	private static void train(RealMatrix inputs, RealMatrix target) {
		// forward
		RealMatrix hiddenInputs = wInputHidden.multiply(inputs);
		RealMatrix hiddenOutputs = scalar(hiddenInputs, Util::sigmoid);

		RealMatrix finalInputs = wHiddenOutput.multiply(hiddenOutputs);
		RealMatrix finalOutputs = scalar(finalInputs, Util::sigmoid);

		// back
		RealMatrix outputErrors = target.subtract(finalOutputs);
		RealMatrix t1 = multiplyElements(outputErrors, finalOutputs);
		RealMatrix t2 = multiplyElements(t1, scalar(finalOutputs, in -> 1.0 - in));
		RealMatrix t3 = t2.multiply(hiddenOutputs.transpose());
		wHiddenOutput = wHiddenOutput.add(scalar(t3, in -> learning_rate * in));

		RealMatrix hiddenErrors = wHiddenOutput.transpose().multiply(outputErrors);
		t1 = multiplyElements(hiddenErrors, hiddenOutputs);
		t2 = multiplyElements(t1, scalar(hiddenOutputs, in -> 1.0 - in));
		t3 = t2.multiply(inputs.transpose());
		wInputHidden = wInputHidden.add(scalar(t3, in -> learning_rate * in));
	}

}
