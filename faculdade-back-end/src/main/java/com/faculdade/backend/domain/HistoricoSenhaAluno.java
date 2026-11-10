package com.faculdade.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "historico_senha_aluno")
@Getter
@Setter
public class HistoricoSenhaAluno {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idHistorico;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_aluno", nullable = false)
    private Aluno aluno;

    @Column(nullable = false)
    private String senhaHash;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant dataCriacao;
}
