package ch.rasc.jwt.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.context.SecurityContextPersistenceFilter;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  private final TokenProvider tokenProvider;

  public SecurityConfig(TokenProvider tokenProvider) {
    this.tokenProvider = tokenProvider;
  }

  @Bean
  @Override
  protected AuthenticationManager authenticationManager() throws Exception {
    return authentication -> {
      throw new AuthenticationServiceException("Cannot authenticate " + authentication);
    };
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.csrf(cust -> cust.disable())
        .cors(Customizer.withDefaults())
        .sessionManagement(
            customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        // optional, if you want to access the
        // services from a browser
        // .httpBasic(Customizer.withDefaults())
        .authorizeRequests(customizer -> {
          customizer.antMatchers("/signup", "/login", "/public").permitAll();
          customizer.anyRequest().authenticated();
        })
        .addFilterAfter(new JWTFilter(this.tokenProvider),
            SecurityContextPersistenceFilter.class);
  }

}