package com.faculdade.backend.repository;

import com.faculdade.backend.domain.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, String> {

    Optional<Aluno> findByEmail(String email);

    boolean existsByEmail(String email);
}
