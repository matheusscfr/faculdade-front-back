package com.faculdade.backend.dto.aluno;

import java.util.List;

public record ListaAlunosCriadosResponse(String message, List<AlunoResponse> alunos) {
}
