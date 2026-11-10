package com.faculdade.backend.repository;

import com.faculdade.backend.domain.Recrutador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecrutadorRepository extends JpaRepository<Recrutador, String> {

    Optional<Recrutador> findByEmail(String email);

    boolean existsByEmail(String email);
}
