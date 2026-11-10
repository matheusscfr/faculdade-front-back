package com.faculdade.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "contratacao")
@Getter
@Setter
public class Contratacao {

    public static final String STATUS_PENDENTE = "PENDENTE";
    public static final String STATUS_ACEITO = "ACEITO";
    public static final String STATUS_RECUSADO = "RECUSADO";

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idContratacao;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_recrutador", nullable = false)
    private Recrutador recrutador;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_aluno", nullable = false)
    private Aluno aluno;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant dataContratacao;

    @Column(nullable = false)
    private String cargo;

    private Double salario;

    @Column(nullable = false)
    private String status;
}
