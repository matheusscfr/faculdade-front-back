package com.faculdade.backend.repository;

import com.faculdade.backend.domain.HistoricoSenhaAluno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoricoSenhaAlunoRepository extends JpaRepository<HistoricoSenhaAluno, String> {

    List<HistoricoSenhaAluno> findByAlunoIdAlunoOrderByDataCriacaoDesc(String idAluno);
}
