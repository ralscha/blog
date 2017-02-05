package ch.rasc.jwt.security;

import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

import ch.rasc.jwt.security.jwt.JWTConfigurer;
import ch.rasc.jwt.security.jwt.TokenProvider;

@Configuration
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	private final TokenProvider tokenProvider;

	public SecurityConfig(TokenProvider tokenProvider) {
		this.tokenProvider = tokenProvider;
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// @formatter:off
		http
		  .csrf()
		    .disable()
		  .cors()
		    .and()
		  .sessionManagement()
			.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			.and()
		//.httpBasic() // optional, if you want to access 
		//  .and()     // the services from a browser
		  .authorizeRequests()
		    .antMatchers("/signup").permitAll()
		    .antMatchers("/login").permitAll()
		    .antMatchers("/public").permitAll()
		    .anyRequest().authenticated()
		    .and()
		  .apply(new JWTConfigurer(this.tokenProvider));
		// @formatter:on
	}

}