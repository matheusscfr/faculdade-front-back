package com.faculdade.backend.service;

import com.faculdade.backend.domain.Empresa;
import com.faculdade.backend.dto.empresa.CriarEmpresaRequest;
import com.faculdade.backend.dto.empresa.EmpresaResponse;
import com.faculdade.backend.exception.ApiException;
import com.faculdade.backend.repository.EmpresaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<EmpresaResponse> listarTodasEmpresas() {
        return empresaRepository.findAll().stream().map(EmpresaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public EmpresaResponse listarUmaEmpresa(String id) {
        return empresaRepository.findById(id)
                .map(EmpresaResponse::from)
                .orElseThrow(() -> ApiException.notFound("Empresa não encontrada"));
    }

    @Transactional
    public EmpresaResponse criarEmpresa(CriarEmpresaRequest dto) {
        if (empresaRepository.existsByCnpj(dto.cnpj())) {
            throw ApiException.conflict("Empresa já cadastrada");
        }
        Empresa empresa = new Empresa();
        empresa.setNome(dto.nome());
        empresa.setCnpj(dto.cnpj());
        empresa.setEndereco(dto.endereco());
        empresa.setSetor(dto.setor());
        empresa.setDescricao(dto.descricao());
        empresa.setWebsite(dto.website());
        empresa = empresaRepository.saveAndFlush(empresa);

        auditService.logCompanyCreated(empresa.getNome(), empresa.getIdEmpresa(), null);
        return EmpresaResponse.from(empresa);
    }
}
