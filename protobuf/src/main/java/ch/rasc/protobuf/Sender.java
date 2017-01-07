package ch.rasc.protobuf;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

import ch.rasc.protobuf.SensorMessageOuterClass.SensorMessage;

public class Sender {
	public static void main(String[] args) throws IOException {
		SensorMessage sm = SensorMessage.newBuilder().setTx(18912).setRx(15000)
				.setTemp(-9.3f).setHumidity(89).build();

		try (DatagramSocket socket = new DatagramSocket()) {
			byte[] buf = sm.toByteArray();
			System.out.printf("Number of Bytes: %d\n", buf.length);
			InetAddress address = InetAddress.getLoopbackAddress();
			DatagramPacket packet = new DatagramPacket(buf, buf.length, address, 9992);
			socket.send(packet);
		}

	}

}
