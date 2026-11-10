package com.faculdade.backend.service;

import com.faculdade.backend.domain.Aluno;
import com.faculdade.backend.domain.Aptidao;
import com.faculdade.backend.domain.HistoricoSenhaAluno;
import com.faculdade.backend.domain.SoftSkill;
import com.faculdade.backend.dto.aluno.*;
import com.faculdade.backend.dto.common.MensagemResponse;
import com.faculdade.backend.exception.ApiException;
import com.faculdade.backend.repository.AlunoRepository;
import com.faculdade.backend.repository.HistoricoSenhaAlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final HistoricoSenhaAlunoRepository historicoRepository;
    private final SenhaService senhaService;
    private final AuditService auditService;

    /** Cria todos os alunos da lista numa única transação (se um falhar, nenhum é salvo). */
    @Transactional
    public ListaAlunosCriadosResponse criarListaAlunos(CriarListaAlunosRequest dto) {
        List<Aluno> criados = new ArrayList<>();
        for (CriarAlunoRequest alunoDto : dto.alunos()) {
            criados.add(criarAluno(alunoDto));
        }
        alunoRepository.flush();
        criados.forEach(a -> auditService.logUserCreated(a.getNome(), a.getIdAluno(), "aluno"));

        List<AlunoResponse> alunos = criados.stream().map(AlunoResponse::from).toList();
        return new ListaAlunosCriadosResponse(alunos.size() + " alunos criados com sucesso", alunos);
    }

    private Aluno criarAluno(CriarAlunoRequest dto) {
        String hash = senhaService.hash(dto.senha());

        Aluno aluno = new Aluno();
        aluno.setNome(dto.nome());
        aluno.setEmail(dto.email());
        aluno.setSenha(hash);
        aluno.setMatricula(dto.matricula());
        aluno.setCurso(dto.curso());
        aluno.setSemestreAtual(dto.semestreAtual());
        aluno.setCpf(dto.cpf());
        aluno.setTelefone(dto.telefone());
        aluno.setDataNascimento(dto.dataNascimento());
        aluno.setEndereco(dto.endereco());
        aluno.setLinkedin(dto.linkedin());
        aluno.setGithub(dto.github());
        aluno.setPortfolio(dto.portfolio());

        for (CriarAptidaoRequest a : dto.aptidoes()) {
            Aptidao aptidao = new Aptidao();
            aptidao.setNome(a.nome());
            aptidao.setNivel(a.nivel());
            aptidao.setDescricao(a.descricao());
            aluno.adicionarAptidao(aptidao);
        }
        for (CriarSoftSkillRequest s : dto.softskills()) {
            SoftSkill softSkill = new SoftSkill();
            softSkill.setNome(s.nome());
            softSkill.setNivel(s.nivel());
            softSkill.setDescricao(s.descricao());
            aluno.adicionarSoftSkill(softSkill);
        }

        HistoricoSenhaAluno historico = new HistoricoSenhaAluno();
        historico.setAluno(aluno);
        historico.setSenhaHash(hash);
        aluno.getHistoricoSenhas().add(historico);

        return alunoRepository.save(aluno);
    }

    @Transactional(readOnly = true)
    public AlunoResponse listarAluno(String id) {
        return AlunoResponse.from(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public List<AlunoResponse> listarTodosAlunos() {
        return alunoRepository.findAll().stream().map(AlunoResponse::from).toList();
    }

    @Transactional
    public MensagemResponse atualizarSenha(String id, String senhaAtual, String novaSenha) {
        Aluno aluno = buscarEntidade(id);

        if (!senhaService.confere(senhaAtual, aluno.getSenha())) {
            throw ApiException.unauthorized("Senha atual incorreta");
        }

        List<HistoricoSenhaAluno> historico = historicoRepository.findByAlunoIdAlunoOrderByDataCriacaoDesc(id);
        senhaService.validarHistorico(historico.stream().map(HistoricoSenhaAluno::getSenhaHash).toList(),
                novaSenha);

        String novoHash = senhaService.hash(novaSenha);
        aluno.setSenha(novoHash);

        HistoricoSenhaAluno novo = new HistoricoSenhaAluno();
        novo.setAluno(aluno);
        novo.setSenhaHash(novoHash);
        aluno.getHistoricoSenhas().add(novo);

        // mantém apenas as últimas 3 senhas no histórico
        List<HistoricoSenhaAluno> ordenado = new ArrayList<>();
        ordenado.add(novo);
        ordenado.addAll(historico);
        ordenado.stream().skip(SenhaService.LIMITE_HISTORICO)
                .forEach(h -> aluno.getHistoricoSenhas().remove(h));

        auditService.logPasswordChanged(aluno.getNome(), aluno.getIdAluno());
        return new MensagemResponse("Senha atualizada com sucesso");
    }

    @Transactional
    public AlunoResponse atualizarAluno(String id, AtualizarAlunoRequest dto) {
        Aluno aluno = buscarEntidade(id);
        List<String> campos = new ArrayList<>();
        if (dto.nome() != null) {
            aluno.setNome(dto.nome());
            campos.add("nome");
        }
        if (dto.telefone() != null) {
            aluno.setTelefone(dto.telefone());
            campos.add("telefone");
        }
        if (dto.endereco() != null) {
            aluno.setEndereco(dto.endereco());
            campos.add("endereco");
        }
        if (dto.linkedin() != null) {
            aluno.setLinkedin(dto.linkedin());
            campos.add("linkedin");
        }
        if (dto.github() != null) {
            aluno.setGithub(dto.github());
            campos.add("github");
        }
        if (dto.portfolio() != null) {
            aluno.setPortfolio(dto.portfolio());
            campos.add("portfolio");
        }
        if (dto.semestreAtual() != null) {
            aluno.setSemestreAtual(dto.semestreAtual());
            campos.add("semestre_atual");
        }
        alunoRepository.saveAndFlush(aluno);

        auditService.logUserUpdated(aluno.getNome(), aluno.getIdAluno(), campos);
        auditService.logStudentProfileUpdated(aluno.getNome(), aluno.getIdAluno(), campos);
        return AlunoResponse.from(aluno);
    }

    @Transactional
    public MensagemResponse excluirAluno(String id) {
        Aluno aluno = buscarEntidade(id);
        alunoRepository.delete(aluno);
        auditService.logUserDeleted(aluno.getNome(), aluno.getIdAluno(), "aluno");
        return new MensagemResponse("Aluno excluído com sucesso");
    }

    private Aluno buscarEntidade(String id) {
        return alunoRepository.findById(id).orElseThrow(() -> ApiException.notFound("Aluno não encontrado"));
    }
}
