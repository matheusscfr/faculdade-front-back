package com.faculdade.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "aluno")
@Getter
@Setter
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idAluno;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false, unique = true)
    private String matricula;

    @Column(nullable = false)
    private String curso;

    @Column(nullable = false)
    private int semestreAtual;

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false)
    private String telefone;

    @Column(nullable = false)
    private Instant dataNascimento;

    @Column(nullable = false)
    private String endereco;

    private String linkedin;

    private String github;

    private String portfolio;

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contratacao> contratacoes = new ArrayList<>();

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Nota> notas = new ArrayList<>();

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Aptidao> aptidoes = new ArrayList<>();

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SoftSkill> softskills = new ArrayList<>();

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HistoricoSenhaAluno> historicoSenhas = new ArrayList<>();

    @Column(nullable = false)
    private int solicitacoes = 0;

    @Column(nullable = false)
    private int tentativasLogin = 0;

    private Instant bloqueadoAte;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant dataCriacao;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant dataAtualizacao;

    public void adicionarAptidao(Aptidao aptidao) {
        aptidao.setAluno(this);
        aptidoes.add(aptidao);
    }

    public void adicionarSoftSkill(SoftSkill softSkill) {
        softSkill.setAluno(this);
        softskills.add(softSkill);
    }

    public void adicionarNota(Nota nota) {
        nota.setAluno(this);
        notas.add(nota);
    }
}
