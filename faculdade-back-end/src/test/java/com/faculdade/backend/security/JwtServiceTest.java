package com.faculdade.backend.security;

import com.faculdade.backend.domain.Empresa;
import com.faculdade.backend.domain.Recrutador;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private final JwtService jwtService = new JwtService(new JwtProperties("segredo-teste", Duration.ofDays(1)));

    @Test
    void geraEValidaToken() {
        Empresa empresa = new Empresa();
        empresa.setIdEmpresa("emp-1");
        Recrutador r = new Recrutador();
        r.setIdRecrutador("rec-1");
        r.setEmail("a@b.com");
        r.setNome("Rec");
        r.setEmpresa(empresa);

        String token = jwtService.gerarToken(r);

        assertThat(jwtService.validarToken(token)).contains("rec-1");
        assertThat(jwtService.validarToken(token + "x")).isEmpty();
        assertThat(new JwtService(new JwtProperties("outro", Duration.ofDays(1))).validarToken(token)).isEmpty();
    }

    @Test
    void rejeitaTokenExpirado() {
        JwtService expirado = new JwtService(new JwtProperties("segredo-teste", Duration.ofSeconds(-10)));
        Empresa empresa = new Empresa();
        empresa.setIdEmpresa("emp-1");
        Recrutador r = new Recrutador();
        r.setIdRecrutador("rec-1");
        r.setEmpresa(empresa);

        assertThat(jwtService.validarToken(expirado.gerarToken(r))).isEmpty();
    }
}
