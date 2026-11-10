package com.faculdade.backend.dto.aluno;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CriarSoftSkillRequest(
        @NotNull String nome,
        @NotNull @Min(1) @Max(5) Integer nivel,
        String descricao) {
}
