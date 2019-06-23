package ch.rasc.jwt.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import ch.rasc.jwt.security.jwt.JWTFilter;
import ch.rasc.jwt.security.jwt.TokenProvider;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  private final TokenProvider tokenProvider;

  public SecurityConfig(TokenProvider tokenProvider) {
    this.tokenProvider = tokenProvider;
  }

  @Bean
  @Override
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    JWTFilter customFilter = new JWTFilter(this.tokenProvider);

    // @formatter:off
		http
		  .csrf().disable()
		  .cors()
		    .and()
		  .sessionManagement()
			  .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			  .and()
		//.httpBasic() // optional, if you want to access
		//  .and()     // the services from a browser
		  .authorizeRequests()
		    .antMatchers("/signup", "/login", "/public").permitAll()
		    .anyRequest().authenticated()
		    .and()
		  .addFilterBefore(customFilter, UsernamePasswordAuthenticationFilter.class);
		// @formatter:on
  }

}