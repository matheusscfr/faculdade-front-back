package com.faculdade.backend.config;

import com.faculdade.backend.exception.ErrorResponse;
import com.faculdade.backend.repository.RecrutadorRepository;
import com.faculdade.backend.security.JwtAuthenticationFilter;
import com.faculdade.backend.security.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtService jwtService,
                                                   RecrutadorRepository recrutadorRepository,
                                                   AuthenticationEntryPoint entryPoint) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // rotas públicas (as mesmas que não tinham AuthGuard no NestJS)
                        .requestMatchers(HttpMethod.POST, "/recrutadores", "/recrutadores/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/aluno").permitAll()
                        .requestMatchers("/empresa", "/empresa/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(e -> e.authenticationEntryPoint(entryPoint))
                .addFilterBefore(new JwtAuthenticationFilter(jwtService, recrutadorRepository),
                        UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    /** Responde 401 no mesmo formato JSON do NestJS. */
    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint(ObjectMapper objectMapper) {
        return (request, response, ex) -> {
            Object erro = request.getAttribute(JwtAuthenticationFilter.ERRO_AUTH_ATTR);
            String mensagem = erro != null ? erro.toString() : "Unauthorized";
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            objectMapper.writeValue(response.getWriter(), ErrorResponse.of(HttpStatus.UNAUTHORIZED, mensagem));
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // compatível com os hashes $2a/$2b gerados pelo bcryptjs no back-end antigo
        return new BCryptPasswordEncoder();
    }
}
