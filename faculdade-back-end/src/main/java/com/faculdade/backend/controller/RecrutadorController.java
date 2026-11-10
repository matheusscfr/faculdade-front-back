package com.faculdade.backend.controller;

import com.faculdade.backend.dto.common.AtualizarSenhaRequest;
import com.faculdade.backend.dto.common.MensagemResponse;
import com.faculdade.backend.dto.recrutador.*;
import com.faculdade.backend.service.RecrutadorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recrutadores")
@RequiredArgsConstructor
public class RecrutadorController {

    private final RecrutadorService recrutadorService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecrutadorResponse criarRecrutador(@Valid @RequestBody CriarRecrutadorRequest dto) {
        return recrutadorService.criarRecrutador(dto);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest dto) {
        return recrutadorService.login(dto);
    }

    @GetMapping("/{id}")
    public RecrutadorResponse buscarRecrutador(@PathVariable String id) {
        return recrutadorService.buscarRecrutador(id);
    }

    @GetMapping
    public List<RecrutadorResponse> listarRecrutadores() {
        return recrutadorService.listarRecrutadores();
    }

    @PostMapping("/oferta-contratacao/{idRecrutador}")
    @ResponseStatus(HttpStatus.CREATED)
    public ContratacaoResponse oferecerContratacao(@PathVariable String idRecrutador,
                                                   @Valid @RequestBody OfertaContratacaoRequest dto) {
        return recrutadorService.oferecerContratacao(idRecrutador, dto);
    }

    @PatchMapping("/{id}/senha")
    public MensagemResponse atualizarSenha(@PathVariable String id, @Valid @RequestBody AtualizarSenhaRequest dto) {
        return recrutadorService.atualizarSenha(id, dto.senhaAtual(), dto.novaSenha());
    }

    @PatchMapping("/{id}")
    public RecrutadorResponse atualizarRecrutador(@PathVariable String id,
                                                  @Valid @RequestBody AtualizarRecrutadorRequest dto) {
        return recrutadorService.atualizarRecrutador(id, dto);
    }

    @DeleteMapping("/{id}")
    public MensagemResponse excluirRecrutador(@PathVariable String id) {
        return recrutadorService.excluirRecrutador(id);
    }
}
