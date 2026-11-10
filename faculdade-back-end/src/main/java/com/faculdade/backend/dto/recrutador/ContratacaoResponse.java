package com.faculdade.backend.dto.recrutador;

import com.faculdade.backend.domain.Aluno;
import com.faculdade.backend.domain.Contratacao;

import java.time.Instant;

public record ContratacaoResponse(
        String idContratacao,
        String idRecrutador,
        String idAluno,
        Instant dataContratacao,
        String cargo,
        Double salario,
        String status,
        AlunoResumo aluno) {

    public record AlunoResumo(String nome, String email, String curso) {
    }

    public static ContratacaoResponse from(Contratacao c) {
        Aluno a = c.getAluno();
        return new ContratacaoResponse(c.getIdContratacao(), c.getRecrutador().getIdRecrutador(), a.getIdAluno(),
                c.getDataContratacao(), c.getCargo(), c.getSalario(), c.getStatus(),
                new AlunoResumo(a.getNome(), a.getEmail(), a.getCurso()));
    }
}
