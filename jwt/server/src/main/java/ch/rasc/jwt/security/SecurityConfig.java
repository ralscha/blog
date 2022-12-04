package ch.rasc.jwt.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.SecurityContextHolderFilter;

@Configuration
public class SecurityConfig {

  private final TokenProvider tokenProvider;

  public SecurityConfig(TokenProvider tokenProvider) {
    this.tokenProvider = tokenProvider;
  }

  @Bean
  AuthenticationManager authenticationManager() {
    return authentication -> {
      throw new AuthenticationServiceException("Cannot authenticate " + authentication);
    };
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(CsrfConfigurer::disable).cors(Customizer.withDefaults()).sessionManagement(
        customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        // optional, if you want to access the
        // services from a browser
        // .httpBasic(Customizer.withDefaults())
        .authorizeHttpRequests(customizer -> {
          customizer.requestMatchers("/signup", "/login", "/public").permitAll();
          customizer.anyRequest().authenticated();
        }).addFilterAfter(new JWTFilter(this.tokenProvider),
            SecurityContextHolderFilter.class);
    return http.build();
  }

}