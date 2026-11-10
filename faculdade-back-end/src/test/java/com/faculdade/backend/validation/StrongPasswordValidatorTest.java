package com.faculdade.backend.validation;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;

class StrongPasswordValidatorTest {

    private final StrongPasswordValidator validator = new StrongPasswordValidator();

    @ParameterizedTest
    @ValueSource(strings = {"SenhaForte@123", "Abcdefgh1!", "x Y 1 # zzzzz"})
    void aceitaSenhasFortes(String senha) {
        assertThat(validator.isValid(senha, null)).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "Curta@1", "semmaiuscula@123", "SEMMINUSCULA@123", "SemNumero@abc", "SemEspecial123"})
    void rejeitaSenhasFracas(String senha) {
        assertThat(validator.isValid(senha, null)).isFalse();
    }

    @org.junit.jupiter.api.Test
    void rejeitaNulo() {
        assertThat(validator.isValid(null, null)).isFalse();
    }
}
