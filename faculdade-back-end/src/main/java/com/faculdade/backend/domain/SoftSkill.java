package com.faculdade.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "softskill")
@Getter
@Setter
public class SoftSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idSoftskill;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_aluno", nullable = false)
    private Aluno aluno;

    @Column(nullable = false)
    private String nome;

    /** 1=Iniciante, 2=Básico, 3=Intermediário, 4=Avançado, 5=Especialista */
    @Column(nullable = false)
    private int nivel;

    private String descricao;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant dataCriacao;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant dataAtualizacao;
}
