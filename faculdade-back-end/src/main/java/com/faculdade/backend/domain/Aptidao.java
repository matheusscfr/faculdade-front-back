package com.faculdade.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "aptidao")
@Getter
@Setter
public class Aptidao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idAptidao;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_aluno", nullable = false)
    private Aluno aluno;

    @Column(nullable = false)
    private String nome;

    /** 1-5 */
    @Column(nullable = false)
    private int nivel;

    private String descricao;
}
