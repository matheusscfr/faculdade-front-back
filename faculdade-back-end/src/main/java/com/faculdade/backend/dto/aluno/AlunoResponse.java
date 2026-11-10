package com.faculdade.backend.dto.aluno;

import com.faculdade.backend.domain.Aluno;
import com.faculdade.backend.domain.Aptidao;
import com.faculdade.backend.domain.SoftSkill;

import java.time.Instant;
import java.util.List;

/** Dados do aluno (sem a senha) com aptidões e softskills, como o "include" do Prisma retornava. */
public record AlunoResponse(
        String idAluno,
        String nome,
        String email,
        String matricula,
        String curso,
        int semestreAtual,
        String cpf,
        String telefone,
        Instant dataNascimento,
        String endereco,
        String linkedin,
        String github,
        String portfolio,
        int solicitacoes,
        int tentativasLogin,
        Instant bloqueadoAte,
        Instant dataCriacao,
        Instant dataAtualizacao,
        List<AptidaoResponse> aptidoes,
        List<SoftSkillResponse> softskills) {

    public record AptidaoResponse(String idAptidao, String idAluno, String nome, int nivel, String descricao) {
        static AptidaoResponse from(Aptidao a, String idAluno) {
            return new AptidaoResponse(a.getIdAptidao(), idAluno, a.getNome(), a.getNivel(), a.getDescricao());
        }
    }

    public record SoftSkillResponse(String idSoftskill, String idAluno, String nome, int nivel, String descricao,
                                    Instant dataCriacao, Instant dataAtualizacao) {
        static SoftSkillResponse from(SoftSkill s, String idAluno) {
            return new SoftSkillResponse(s.getIdSoftskill(), idAluno, s.getNome(), s.getNivel(), s.getDescricao(),
                    s.getDataCriacao(), s.getDataAtualizacao());
        }
    }

    public static AlunoResponse from(Aluno a) {
        String id = a.getIdAluno();
        return new AlunoResponse(id, a.getNome(), a.getEmail(), a.getMatricula(), a.getCurso(),
                a.getSemestreAtual(), a.getCpf(), a.getTelefone(), a.getDataNascimento(), a.getEndereco(),
                a.getLinkedin(), a.getGithub(), a.getPortfolio(), a.getSolicitacoes(), a.getTentativasLogin(),
                a.getBloqueadoAte(), a.getDataCriacao(), a.getDataAtualizacao(),
                a.getAptidoes().stream().map(ap -> AptidaoResponse.from(ap, id)).toList(),
                a.getSoftskills().stream().map(s -> SoftSkillResponse.from(s, id)).toList());
    }
}
