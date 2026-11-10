package com.faculdade.backend.dto.recrutador;

import com.faculdade.backend.validation.StrongPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CriarRecrutadorRequest(
        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank @StrongPassword String senha,
        @NotBlank String cargo,
        @NotBlank String telefone,
        @NotBlank String idEmpresa) {
}
