package com.faculdade.backend.controller;

import com.faculdade.backend.dto.aluno.AlunoResponse;
import com.faculdade.backend.dto.aluno.AtualizarAlunoRequest;
import com.faculdade.backend.dto.aluno.CriarListaAlunosRequest;
import com.faculdade.backend.dto.aluno.ListaAlunosCriadosResponse;
import com.faculdade.backend.dto.common.AtualizarSenhaRequest;
import com.faculdade.backend.dto.common.MensagemResponse;
import com.faculdade.backend.service.AlunoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/aluno")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ListaAlunosCriadosResponse criarAlunos(@Valid @RequestBody CriarListaAlunosRequest dto) {
        return alunoService.criarListaAlunos(dto);
    }

    @GetMapping("/{id}")
    public AlunoResponse listarAluno(@PathVariable String id) {
        return alunoService.listarAluno(id);
    }

    @GetMapping
    public List<AlunoResponse> listarTodosAlunos() {
        return alunoService.listarTodosAlunos();
    }

    @PatchMapping("/{id}/senha")
    public MensagemResponse atualizarSenha(@PathVariable String id, @Valid @RequestBody AtualizarSenhaRequest dto) {
        return alunoService.atualizarSenha(id, dto.senhaAtual(), dto.novaSenha());
    }

    @PatchMapping("/{id}")
    public AlunoResponse atualizarAluno(@PathVariable String id, @Valid @RequestBody AtualizarAlunoRequest dto) {
        return alunoService.atualizarAluno(id, dto);
    }

    @DeleteMapping("/{id}")
    public MensagemResponse excluirAluno(@PathVariable String id) {
        return alunoService.excluirAluno(id);
    }
}
