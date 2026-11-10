package com.faculdade.backend.controller;

import com.faculdade.backend.dto.empresa.CriarEmpresaRequest;
import com.faculdade.backend.dto.empresa.EmpresaResponse;
import com.faculdade.backend.service.EmpresaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empresa")
@RequiredArgsConstructor
public class EmpresaController {

    private final EmpresaService empresaService;

    @GetMapping
    public List<EmpresaResponse> listarTodasEmpresas() {
        return empresaService.listarTodasEmpresas();
    }

    @GetMapping("/{id}")
    public EmpresaResponse listarUmaEmpresa(@PathVariable String id) {
        return empresaService.listarUmaEmpresa(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmpresaResponse criarEmpresa(@Valid @RequestBody CriarEmpresaRequest dto) {
        return empresaService.criarEmpresa(dto);
    }
}
