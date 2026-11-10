package com.faculdade.backend.repository;

import com.faculdade.backend.domain.Contratacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContratacaoRepository extends JpaRepository<Contratacao, String> {
}
