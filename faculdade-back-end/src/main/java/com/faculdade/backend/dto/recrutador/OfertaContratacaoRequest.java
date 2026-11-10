package com.faculdade.backend.dto.recrutador;

import jakarta.validation.constraints.NotNull;

public record OfertaContratacaoRequest(
        @NotNull String idAluno,
        @NotNull String cargo,
        Double salario) {
}
