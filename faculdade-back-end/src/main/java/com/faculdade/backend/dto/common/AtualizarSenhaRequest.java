package com.faculdade.backend.dto.common;

import com.faculdade.backend.validation.StrongPassword;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

/** Usado por recrutadores e alunos. Mantém os nomes camelCase da API original. */
public record AtualizarSenhaRequest(
        @JsonProperty("senhaAtual") @NotBlank String senhaAtual,
        @JsonProperty("novaSenha") @NotBlank @StrongPassword String novaSenha) {
}
