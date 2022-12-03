package ch.rasc.protobuf;

import java.util.concurrent.TimeUnit;

import org.apache.commons.logging.LogFactory;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.config.EnableIntegration;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.integration.ip.dsl.Udp;
import org.springframework.messaging.Message;

import com.google.protobuf.InvalidProtocolBufferException;

import ch.rasc.protobuf.SensorMessageOuterClass.SensorMessage;

@Configuration
@EnableIntegration
public class Receiver {

  public static void main(String[] args) throws InterruptedException {
    try (AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
        Receiver.class)) {
      TimeUnit.MINUTES.sleep(2);
    }
  }

  @Bean
  public IntegrationFlow flow() {
    return IntegrationFlow.from(Udp.inboundAdapter(9992))
        .transform(this::transformMessage).handle(this::handleMessage).get();
  }

  private SensorMessage transformMessage(byte[] payload) {
    try {
      return SensorMessage.parseFrom(payload);
    }
    catch (InvalidProtocolBufferException e) {
      LogFactory.getLog(Receiver.class).error("transform", e);
      return null;
    }
  }

  private void handleMessage(Message<?> msg) {
    SensorMessage sensorMessage = (SensorMessage) msg.getPayload();
    System.out.println(sensorMessage);
  }

}
