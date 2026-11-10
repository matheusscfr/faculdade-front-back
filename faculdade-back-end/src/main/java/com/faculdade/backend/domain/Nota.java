package com.faculdade.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "nota")
@Getter
@Setter
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idNota;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_aluno", nullable = false)
    private Aluno aluno;

    @Column(nullable = false)
    private String disciplina;

    @Column(nullable = false)
    private double nota;

    @Column(nullable = false)
    private int semestre;
}
