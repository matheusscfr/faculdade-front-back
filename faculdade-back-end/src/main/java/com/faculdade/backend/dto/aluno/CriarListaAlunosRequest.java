package com.faculdade.backend.dto.aluno;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CriarListaAlunosRequest(@NotNull List<@Valid @NotNull CriarAlunoRequest> alunos) {
}
