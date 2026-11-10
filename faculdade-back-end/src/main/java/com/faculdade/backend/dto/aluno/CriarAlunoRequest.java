package com.faculdade.backend.dto.aluno;

import com.faculdade.backend.config.FlexibleInstantDeserializer;
import com.faculdade.backend.validation.StrongPassword;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.List;

public record CriarAlunoRequest(
        @NotNull String nome,
        @NotBlank @Email String email,
        @NotNull @StrongPassword String senha,
        @NotNull String matricula,
        @NotNull String curso,
        @NotNull Integer semestreAtual,
        @NotNull String cpf,
        @NotNull String telefone,
        @NotNull @JsonDeserialize(using = FlexibleInstantDeserializer.class) Instant dataNascimento,
        @NotNull String endereco,
        String linkedin,
        String github,
        String portfolio,
        @NotNull List<@Valid @NotNull CriarAptidaoRequest> aptidoes,
        @NotNull List<@Valid @NotNull CriarSoftSkillRequest> softskills) {
}
