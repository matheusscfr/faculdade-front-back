package com.faculdade.backend.service;

import com.faculdade.backend.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/** Hash de senhas e regra de "não reutilizar as últimas N senhas". */
@Service
@RequiredArgsConstructor
public class SenhaService {

    public static final int LIMITE_HISTORICO = 3;

    private final PasswordEncoder passwordEncoder;

    public String hash(String senha) {
        return passwordEncoder.encode(senha);
    }

    public boolean confere(String senha, String hash) {
        return senha != null && hash != null && passwordEncoder.matches(senha, hash);
    }

    /** @param hashesRecentes hashes do histórico, do mais recente para o mais antigo */
    public void validarHistorico(List<String> hashesRecentes, String novaSenha) {
        hashesRecentes.stream()
                .limit(LIMITE_HISTORICO)
                .filter(h -> confere(novaSenha, h))
                .findAny()
                .ifPresent(h -> {
                    throw ApiException.badRequest(
                            "A nova senha não pode ser igual a nenhuma das últimas 3 senhas utilizadas");
                });
    }
}
