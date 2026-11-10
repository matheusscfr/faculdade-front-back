package com.faculdade.backend.repository;

import com.faculdade.backend.domain.HistoricoSenhaRecrutador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoricoSenhaRecrutadorRepository extends JpaRepository<HistoricoSenhaRecrutador, String> {

    List<HistoricoSenhaRecrutador> findByRecrutadorIdRecrutadorOrderByDataCriacaoDesc(String idRecrutador);
}
