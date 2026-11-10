package com.faculdade.backend.service;

import com.faculdade.backend.exception.ApiException;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SenhaServiceTest {

    private final SenhaService senhaService = new SenhaService(new BCryptPasswordEncoder(4));

    @Test
    void confereHashGeradoPeloBcryptjs() {
        // hash gerado pelo bcryptjs 3 (back-end NestJS antigo): bcrypt.hashSync("123456", 8)
        String hashNode = "$2b$08$D9qcWj1HBx3Wejmo27OyF.fyGUMY2FSjoMcdedBqjiHYmBd8hUrJW";
        assertThat(senhaService.confere("123456", hashNode)).isTrue();
        assertThat(senhaService.confere("654321", hashNode)).isFalse();
    }

    @Test
    void bloqueiaReusoDasUltimasTresSenhas() {
        List<String> historico = List.of(senhaService.hash("s3"), senhaService.hash("s2"), senhaService.hash("s1"));

        assertThatThrownBy(() -> senhaService.validarHistorico(historico, "s1"))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("últimas 3 senhas");
        assertThatCode(() -> senhaService.validarHistorico(historico, "nova")).doesNotThrowAnyException();
    }

    @Test
    void consideraApenasAsTresMaisRecentes() {
        List<String> historico = List.of(senhaService.hash("s4"), senhaService.hash("s3"), senhaService.hash("s2"),
                senhaService.hash("s1"));
        assertThatCode(() -> senhaService.validarHistorico(historico, "s1")).doesNotThrowAnyException();
    }
}
