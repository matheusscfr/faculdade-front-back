package com.faculdade.backend.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.faculdade.backend.domain.Recrutador;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

/** Gera e valida tokens HS256 com o mesmo payload que o NestJS usava (sub, email, nome, id_empresa). */
@Service
public class JwtService {

    private final Algorithm algorithm;
    private final JWTVerifier verifier;
    private final JwtProperties properties;

    public JwtService(JwtProperties properties) {
        this.properties = properties;
        this.algorithm = Algorithm.HMAC256(properties.secret());
        this.verifier = JWT.require(algorithm).build();
    }

    public String gerarToken(Recrutador recrutador) {
        Instant agora = Instant.now();
        return JWT.create()
                .withSubject(recrutador.getIdRecrutador())
                .withClaim("email", recrutador.getEmail())
                .withClaim("nome", recrutador.getNome())
                .withClaim("id_empresa", recrutador.getEmpresa().getIdEmpresa())
                .withIssuedAt(agora)
                .withExpiresAt(agora.plus(properties.expiration()))
                .sign(algorithm);
    }

    /** Retorna o "sub" (id do recrutador) se o token for válido e não estiver expirado. */
    public Optional<String> validarToken(String token) {
        try {
            return Optional.ofNullable(verifier.verify(token).getSubject());
        } catch (JWTVerificationException e) {
            return Optional.empty();
        }
    }
}
