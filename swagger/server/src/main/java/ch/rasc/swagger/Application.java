package ch.rasc.swagger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@SpringBootApplication
public class Application {

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }

  @Bean
  public Docket api() {
    return new Docket(DocumentationType.SWAGGER_2).useDefaultResponseMessages(false)
        .apiInfo(new ApiInfoBuilder().title("Todo API Endpoints").version("1").build())
        .select().apis(RequestHandlerSelectors.basePackage("ch.rasc.swagger.todo"))
        .paths(PathSelectors.any()).build();
  }
}
