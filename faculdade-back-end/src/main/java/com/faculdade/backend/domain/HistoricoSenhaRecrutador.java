package com.faculdade.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "historico_senha_recrutador")
@Getter
@Setter
public class HistoricoSenhaRecrutador {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idHistorico;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_recrutador", nullable = false)
    private Recrutador recrutador;

    @Column(nullable = false)
    private String senhaHash;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant dataCriacao;
}
