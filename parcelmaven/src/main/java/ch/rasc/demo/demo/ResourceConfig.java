package ch.rasc.demo.demo;

import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
class ResourceConfig implements WebMvcConfigurer {

  @Autowired
  private Environment environment;

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    if (this.environment.acceptsProfiles("development")) {
      String userDir = System.getProperty("user.dir");
      registry.addResourceHandler("/**")
          .addResourceLocations(
              Paths.get(userDir, "src/main/frontend/dist").toUri().toString())
          .setCachePeriod(0);
    }
    else {
      registry.addResourceHandler("/", "/index.html")
          .addResourceLocations("classpath:/static/")
          .setCacheControl(CacheControl.noCache());
      registry.addResourceHandler("/**").addResourceLocations("classpath:/static/")
          .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePublic());
    }
  }

}
