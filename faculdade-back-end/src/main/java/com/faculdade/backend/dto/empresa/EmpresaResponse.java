package com.faculdade.backend.dto.empresa;

import com.faculdade.backend.domain.Empresa;

import java.time.Instant;

public record EmpresaResponse(
        String idEmpresa,
        String nome,
        String cnpj,
        String endereco,
        String setor,
        String descricao,
        String website,
        Instant dataCriacao,
        Instant dataAtualizacao) {

    public static EmpresaResponse from(Empresa e) {
        return new EmpresaResponse(e.getIdEmpresa(), e.getNome(), e.getCnpj(), e.getEndereco(), e.getSetor(),
                e.getDescricao(), e.getWebsite(), e.getDataCriacao(), e.getDataAtualizacao());
    }
}
