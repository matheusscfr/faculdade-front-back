package com.faculdade.backend.service;

import com.faculdade.backend.domain.Aluno;
import com.faculdade.backend.domain.Contratacao;
import com.faculdade.backend.domain.Empresa;
import com.faculdade.backend.domain.HistoricoSenhaRecrutador;
import com.faculdade.backend.domain.Recrutador;
import com.faculdade.backend.dto.common.MensagemResponse;
import com.faculdade.backend.dto.recrutador.*;
import com.faculdade.backend.exception.ApiException;
import com.faculdade.backend.repository.AlunoRepository;
import com.faculdade.backend.repository.ContratacaoRepository;
import com.faculdade.backend.repository.EmpresaRepository;
import com.faculdade.backend.repository.HistoricoSenhaRecrutadorRepository;
import com.faculdade.backend.repository.RecrutadorRepository;
import com.faculdade.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecrutadorService {

    static final int MAX_TENTATIVAS_LOGIN = 5;
    static final int MINUTOS_BLOQUEIO = 10;

    private final RecrutadorRepository recrutadorRepository;
    private final EmpresaRepository empresaRepository;
    private final AlunoRepository alunoRepository;
    private final ContratacaoRepository contratacaoRepository;
    private final HistoricoSenhaRecrutadorRepository historicoRepository;
    private final SenhaService senhaService;
    private final JwtService jwtService;
    private final AuditService auditService;

    @Transactional
    public RecrutadorResponse criarRecrutador(CriarRecrutadorRequest dto) {
        if (recrutadorRepository.existsByEmail(dto.email())) {
            throw ApiException.conflict("Recrutador já cadastrado");
        }
        Empresa empresa = empresaRepository.findById(dto.idEmpresa())
                .orElseThrow(() -> ApiException.notFound("Empresa não encontrada"));

        String hash = senhaService.hash(dto.senha());

        Recrutador recrutador = new Recrutador();
        recrutador.setNome(dto.nome());
        recrutador.setEmail(dto.email());
        recrutador.setSenha(hash);
        recrutador.setCargo(dto.cargo());
        recrutador.setTelefone(dto.telefone());
        recrutador.setEmpresa(empresa);
        adicionarAoHistorico(recrutador, hash);
        recrutador = recrutadorRepository.saveAndFlush(recrutador);

        auditService.logUserCreated(recrutador.getNome(), recrutador.getIdRecrutador(), "recrutador");
        return RecrutadorResponse.from(recrutador);
    }

    /**
     * Login com bloqueio de 10 minutos após 5 tentativas falhas.
     * noRollbackFor: o contador de tentativas precisa ser salvo mesmo quando o login falha.
     */
    @Transactional(noRollbackFor = ApiException.class)
    public LoginResponse login(LoginRequest dto) {
        Recrutador recrutador = validarCredenciais(dto.email(), dto.senha());
        auditService.logAuthSuccess(recrutador.getNome(), recrutador.getIdRecrutador());

        return new LoginResponse(
                jwtService.gerarToken(recrutador),
                new LoginResponse.UsuarioLogado(recrutador.getIdRecrutador(), recrutador.getNome(),
                        recrutador.getEmail(), recrutador.getEmpresa().getIdEmpresa()));
    }

    private Recrutador validarCredenciais(String email, String senha) {
        Recrutador recrutador = recrutadorRepository.findByEmail(email).orElseThrow(() -> {
            auditService.logAuthFailure(email, "Usuário não encontrado");
            return ApiException.unauthorized("Credenciais inválidas");
        });

        Instant agora = Instant.now();
        if (recrutador.getBloqueadoAte() != null) {
            if (agora.isBefore(recrutador.getBloqueadoAte())) {
                long segundos = Duration.between(agora, recrutador.getBloqueadoAte()).getSeconds();
                long minutosRestantes = (long) Math.ceil(segundos / 60.0);
                auditService.logAccountLocked(recrutador.getNome(), recrutador.getIdRecrutador(),
                        "Tentativa de acesso com conta bloqueada. " + minutosRestantes + " minuto(s) restante(s)");
                throw ApiException.unauthorized(
                        "Conta bloqueada. Tente novamente em " + minutosRestantes + " minuto(s)");
            }
            // desbloqueio automático após o tempo de bloqueio
            recrutador.setBloqueadoAte(null);
            recrutador.setTentativasLogin(0);
        }

        if (!senhaService.confere(senha, recrutador.getSenha())) {
            int tentativas = recrutador.getTentativasLogin() + 1;
            recrutador.setTentativasLogin(tentativas);

            if (tentativas >= MAX_TENTATIVAS_LOGIN) {
                recrutador.setBloqueadoAte(agora.plus(Duration.ofMinutes(MINUTOS_BLOQUEIO)));
                recrutadorRepository.save(recrutador);
                auditService.logMultipleAuthFailures(recrutador.getNome(), tentativas);
                auditService.logAccountLocked(recrutador.getNome(), recrutador.getIdRecrutador(),
                        "Conta bloqueada após " + MAX_TENTATIVAS_LOGIN + " tentativas falhas");
                throw ApiException.unauthorized("Conta bloqueada por " + MINUTOS_BLOQUEIO + " minutos após "
                        + MAX_TENTATIVAS_LOGIN + " tentativas falhas");
            }

            recrutadorRepository.save(recrutador);
            auditService.logAuthFailure(recrutador.getNome(),
                    "Senha incorreta. Tentativa " + tentativas + " de " + MAX_TENTATIVAS_LOGIN);
            throw ApiException.unauthorized("Credenciais inválidas. "
                    + (MAX_TENTATIVAS_LOGIN - tentativas) + " tentativa(s) restante(s)");
        }

        if (recrutador.getTentativasLogin() > 0) {
            recrutador.setTentativasLogin(0);
        }
        return recrutador;
    }

    @Transactional(readOnly = true)
    public RecrutadorResponse buscarRecrutador(String id) {
        return RecrutadorResponse.from(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public List<RecrutadorResponse> listarRecrutadores() {
        return recrutadorRepository.findAll().stream().map(RecrutadorResponse::from).toList();
    }

    @Transactional
    public MensagemResponse atualizarSenha(String id, String senhaAtual, String novaSenha) {
        Recrutador recrutador = buscarEntidade(id);

        if (!senhaService.confere(senhaAtual, recrutador.getSenha())) {
            throw ApiException.unauthorized("Senha atual incorreta");
        }

        List<HistoricoSenhaRecrutador> historico =
                historicoRepository.findByRecrutadorIdRecrutadorOrderByDataCriacaoDesc(id);
        senhaService.validarHistorico(historico.stream().map(HistoricoSenhaRecrutador::getSenhaHash).toList(),
                novaSenha);

        String novoHash = senhaService.hash(novaSenha);
        recrutador.setSenha(novoHash);
        HistoricoSenhaRecrutador novo = adicionarAoHistorico(recrutador, novoHash);

        // mantém apenas as últimas 3 senhas no histórico
        List<HistoricoSenhaRecrutador> ordenado = new ArrayList<>();
        ordenado.add(novo);
        ordenado.addAll(historico);
        ordenado.stream().skip(SenhaService.LIMITE_HISTORICO)
                .forEach(h -> recrutador.getHistoricoSenhas().remove(h));

        auditService.logPasswordChanged(recrutador.getNome(), recrutador.getIdRecrutador());
        return new MensagemResponse("Senha atualizada com sucesso");
    }

    @Transactional
    public ContratacaoResponse oferecerContratacao(String idRecrutador, OfertaContratacaoRequest dto) {
        Aluno aluno = alunoRepository.findById(dto.idAluno())
                .orElseThrow(() -> ApiException.notFound("Aluno não encontrado"));
        Recrutador recrutador = buscarEntidade(idRecrutador);

        Contratacao contratacao = new Contratacao();
        contratacao.setRecrutador(recrutador);
        contratacao.setAluno(aluno);
        contratacao.setCargo(dto.cargo());
        contratacao.setSalario(dto.salario());
        contratacao.setStatus(Contratacao.STATUS_PENDENTE);
        contratacao = contratacaoRepository.saveAndFlush(contratacao);

        aluno.setSolicitacoes(aluno.getSolicitacoes() + 1);

        auditService.logJobOfferCreated(recrutador.getNome(), recrutador.getIdRecrutador(), aluno.getNome(),
                dto.cargo());
        return ContratacaoResponse.from(contratacao);
    }

    @Transactional
    public RecrutadorResponse atualizarRecrutador(String id, AtualizarRecrutadorRequest dto) {
        Recrutador recrutador = buscarEntidade(id);
        List<String> campos = new ArrayList<>();
        if (dto.nome() != null) {
            recrutador.setNome(dto.nome());
            campos.add("nome");
        }
        if (dto.cargo() != null) {
            recrutador.setCargo(dto.cargo());
            campos.add("cargo");
        }
        if (dto.telefone() != null) {
            recrutador.setTelefone(dto.telefone());
            campos.add("telefone");
        }
        recrutadorRepository.saveAndFlush(recrutador);

        auditService.logUserUpdated(recrutador.getNome(), recrutador.getIdRecrutador(), campos);
        return RecrutadorResponse.from(recrutador);
    }

    @Transactional
    public MensagemResponse excluirRecrutador(String id) {
        Recrutador recrutador = buscarEntidade(id);
        recrutadorRepository.delete(recrutador);
        auditService.logUserDeleted(recrutador.getNome(), recrutador.getIdRecrutador(), "recrutador");
        return new MensagemResponse("Recrutador excluído com sucesso");
    }

    private Recrutador buscarEntidade(String id) {
        return recrutadorRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Recrutador não encontrado"));
    }

    private HistoricoSenhaRecrutador adicionarAoHistorico(Recrutador recrutador, String hash) {
        HistoricoSenhaRecrutador h = new HistoricoSenhaRecrutador();
        h.setRecrutador(recrutador);
        h.setSenhaHash(hash);
        recrutador.getHistoricoSenhas().add(h);
        return h;
    }
}
