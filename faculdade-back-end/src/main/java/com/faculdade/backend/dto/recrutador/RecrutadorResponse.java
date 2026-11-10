package com.faculdade.backend.dto.recrutador;

import com.faculdade.backend.domain.Recrutador;

import java.time.Instant;

/** Dados do recrutador sem a senha. */
public record RecrutadorResponse(
        String idRecrutador,
        String nome,
        String email,
        String cargo,
        String telefone,
        String idEmpresa,
        int tentativasLogin,
        Instant bloqueadoAte,
        Instant dataCriacao,
        Instant dataAtualizacao) {

    public static RecrutadorResponse from(Recrutador r) {
        return new RecrutadorResponse(r.getIdRecrutador(), r.getNome(), r.getEmail(), r.getCargo(),
                r.getTelefone(), r.getEmpresa().getIdEmpresa(), r.getTentativasLogin(), r.getBloqueadoAte(),
                r.getDataCriacao(), r.getDataAtualizacao());
    }
}
