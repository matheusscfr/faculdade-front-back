package com.faculdade.backend.security;

import com.faculdade.backend.repository.RecrutadorRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/** Equivalente ao JwtStrategy do passport: valida o Bearer token e confere se o recrutador ainda existe. */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    public static final String ERRO_AUTH_ATTR = "jwt.erro";

    private final JwtService jwtService;
    private final RecrutadorRepository recrutadorRepository;

    public JwtAuthenticationFilter(JwtService jwtService, RecrutadorRepository recrutadorRepository) {
        this.jwtService = jwtService;
        this.recrutadorRepository = recrutadorRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            jwtService.validarToken(header.substring(7).trim()).ifPresent(idRecrutador -> {
                if (recrutadorRepository.existsById(idRecrutador)) {
                    var auth = new UsernamePasswordAuthenticationToken(idRecrutador, null, List.of());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } else {
                    request.setAttribute(ERRO_AUTH_ATTR, "Recrutador não encontrado");
                }
            });
        }
        chain.doFilter(request, response);
    }
}
