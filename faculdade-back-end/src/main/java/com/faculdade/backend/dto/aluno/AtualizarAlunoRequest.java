package com.faculdade.backend.dto.aluno;

public record AtualizarAlunoRequest(
        String nome,
        String telefone,
        String endereco,
        String linkedin,
        String github,
        String portfolio,
        Integer semestreAtual) {
}
