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
@Table(name = "recrutador")
@Getter
@Setter
public class Recrutador {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idRecrutador;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private String cargo;

    @Column(nullable = false)
    private String telefone;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @OneToMany(mappedBy = "recrutador", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contratacao> contratacoes = new ArrayList<>();

    @OneToMany(mappedBy = "recrutador", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HistoricoSenhaRecrutador> historicoSenhas = new ArrayList<>();

    @Column(nullable = false)
    private int tentativasLogin = 0;

    private Instant bloqueadoAte;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant dataCriacao;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant dataAtualizacao;
}
