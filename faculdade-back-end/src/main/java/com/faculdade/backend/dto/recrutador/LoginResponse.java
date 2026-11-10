package com.faculdade.backend.dto.recrutador;

public record LoginResponse(String accessToken, UsuarioLogado user) {

    public record UsuarioLogado(String idRecrutador, String nome, String email, String idEmpresa) {
    }
}
