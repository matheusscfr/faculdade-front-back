package com.faculdade.backend.dto.empresa;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CriarEmpresaRequest(
        @NotBlank String nome,
        @NotBlank @Pattern(regexp = "^\\d{14}$", message = "CNPJ deve conter 14 dígitos") String cnpj,
        @NotBlank String endereco,
        @NotBlank String setor,
        @NotNull String descricao,
        @NotNull String website) {
}
