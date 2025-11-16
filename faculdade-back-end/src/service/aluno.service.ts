import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { CriarAlunoDto } from '../dto/criar-aluno.dto';
import { CriarListaAlunosDto } from '../dto/criar-lista-alunos.dto';
import { AtualizarAlunoDto } from '../dto/atualizar-aluno.dto';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';

@Injectable()
export class AlunoService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MINUTES = 10;
  private readonly PASSWORD_HISTORY_LIMIT = 3;

  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async criarAluno(createAlunoDto: CriarAlunoDto) {
    const { aptidoes, softskills, senha, ...dadosAluno } = createAlunoDto;

    // Hashear a senha
    const senhaHash = await hash(senha, 8);

    const aluno = await this.prisma.aluno.create({
      data: {
        ...dadosAluno,
        senha: senhaHash,
        aptidoes: {
          create: aptidoes,
        },
        softskills: {
          create: softskills,
        },
      },
      include: {
        aptidoes: true,
        softskills: true,
      },
    });

    // Adicionar senha ao histórico
    await this.prisma.historicoSenhaAluno.create({
      data: {
        id_aluno: aluno.id_aluno,
        senha_hash: senhaHash,
      },
    });

    // Log de auditoria
    this.auditService.logUserCreated(aluno.nome, aluno.id_aluno, 'aluno');

    return aluno;
  }

  async criarListaAlunos(criarListaAlunosDto: CriarListaAlunosDto) {
    const resultados: CriarAlunoDto[] = [];

    for (const alunoDto of criarListaAlunosDto.alunos) {
      const { aptidoes, softskills, senha, ...dadosAluno } = alunoDto;

      // Hashear a senha
      const senhaHash = await hash(senha, 8);

      const aluno = await this.prisma.aluno.create({
        data: {
          ...dadosAluno,
          senha: senhaHash,
          aptidoes: {
            create: aptidoes,
          },
          softskills: {
            create: softskills,
          },
        },
        include: {
          aptidoes: true,
          softskills: true,
        },
      });

      // Adicionar senha ao histórico
      await this.prisma.historicoSenhaAluno.create({
        data: {
          id_aluno: aluno.id_aluno,
          senha_hash: senhaHash,
        },
      });

      resultados.push(aluno as CriarAlunoDto);
    }

    return {
      message: `${resultados.length} alunos criados com sucesso`,
      alunos: resultados,
    };
  }

  async listarAluno(id: string) {
    return this.prisma.aluno.findUnique({
      where: { id_aluno: id },
      include: {
        aptidoes: true,
        softskills: true,
      },
    });
  }

  async listarTodosAlunos() {
    return this.prisma.aluno.findMany({
      include: {
        aptidoes: true,
        softskills: true,
      },
    });
  }

  /**
   * Valida aluno para login (com bloqueio após tentativas falhas)
   */
  async validateAluno(email: string, senha: string): Promise<any> {
    const aluno = await this.prisma.aluno.findUnique({
      where: { email },
    });
    if (!aluno) {
      this.auditService.logAuthFailure(email, 'Usuário não encontrado');
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar se a conta está bloqueada
    if (aluno.bloqueado_ate) {
      const now = new Date();
      if (now < aluno.bloqueado_ate) {
        const minutosRestantes = Math.ceil(
          (aluno.bloqueado_ate.getTime() - now.getTime()) / (1000 * 60),
        );
        this.auditService.logAccountLocked(
          aluno.nome,
          aluno.id_aluno,
          `Tentativa de acesso com conta bloqueada. ${minutosRestantes} minuto(s) restante(s)`,
        );
        throw new UnauthorizedException(
          `Conta bloqueada. Tente novamente em ${minutosRestantes} minuto(s)`,
        );
      } else {
        // Desbloqueio automático se o tempo passou
        await this.prisma.aluno.update({
          where: { id_aluno: aluno.id_aluno },
          data: {
            bloqueado_ate: null,
            tentativas_login: 0,
          },
        });
      }
    }

    const passwordMatch = await compare(senha, aluno.senha);
    if (!passwordMatch) {
      // Incrementar tentativas de login
      const novasTentativas = aluno.tentativas_login + 1;

      if (novasTentativas >= this.MAX_LOGIN_ATTEMPTS) {
        // Bloquear a conta
        const bloqueadoAte = new Date();
        bloqueadoAte.setMinutes(
          bloqueadoAte.getMinutes() + this.LOCKOUT_DURATION_MINUTES,
        );

        await this.prisma.aluno.update({
          where: { id_aluno: aluno.id_aluno },
          data: {
            tentativas_login: novasTentativas,
            bloqueado_ate: bloqueadoAte,
          },
        });

        // Log de múltiplas falhas e bloqueio
        this.auditService.logMultipleAuthFailures(aluno.nome, novasTentativas);
        this.auditService.logAccountLocked(
          aluno.nome,
          aluno.id_aluno,
          `Conta bloqueada após ${this.MAX_LOGIN_ATTEMPTS} tentativas falhas`,
        );

        throw new UnauthorizedException(
          `Conta bloqueada por ${this.LOCKOUT_DURATION_MINUTES} minutos após ${this.MAX_LOGIN_ATTEMPTS} tentativas falhas`,
        );
      } else {
        // Apenas incrementar tentativas
        await this.prisma.aluno.update({
          where: { id_aluno: aluno.id_aluno },
          data: { tentativas_login: novasTentativas },
        });

        // Log de falha de autenticação
        this.auditService.logAuthFailure(
          aluno.nome,
          `Senha incorreta. Tentativa ${novasTentativas} de ${this.MAX_LOGIN_ATTEMPTS}`,
        );

        const tentativasRestantes = this.MAX_LOGIN_ATTEMPTS - novasTentativas;
        throw new UnauthorizedException(
          `Credenciais inválidas. ${tentativasRestantes} tentativa(s) restante(s)`,
        );
      }
    }

    // Login bem-sucedido - resetar tentativas
    if (aluno.tentativas_login > 0) {
      await this.prisma.aluno.update({
        where: { id_aluno: aluno.id_aluno },
        data: { tentativas_login: 0 },
      });
    }

    const { senha: _, ...result } = aluno;
    return result;
  }

  /**
   * Valida se a nova senha não está no histórico das últimas 3 senhas
   */
  private async validarHistoricoSenha(
    id_aluno: string,
    novaSenha: string,
  ): Promise<void> {
    // Buscar as últimas 3 senhas do histórico
    const historico = await this.prisma.historicoSenhaAluno.findMany({
      where: { id_aluno },
      orderBy: { data_criacao: 'desc' },
      take: this.PASSWORD_HISTORY_LIMIT,
    });

    // Verificar se a nova senha é igual a alguma das últimas 3
    for (const registro of historico) {
      const senhaIgual = await compare(novaSenha, registro.senha_hash);
      if (senhaIgual) {
        throw new BadRequestException(
          'A nova senha não pode ser igual a nenhuma das últimas 3 senhas utilizadas',
        );
      }
    }
  }

  /**
   * Atualiza a senha do aluno
   */
  async atualizarSenha(
    id_aluno: string,
    senhaAtual: string,
    novaSenha: string,
  ) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
    }

    // Validar senha atual
    const senhaAtualValida = await compare(senhaAtual, aluno.senha);
    if (!senhaAtualValida) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Validar histórico de senhas
    await this.validarHistoricoSenha(id_aluno, novaSenha);

    // Hashear nova senha
    const novaSenhaHash = await hash(novaSenha, 8);

    // Atualizar senha
    await this.prisma.aluno.update({
      where: { id_aluno },
      data: { senha: novaSenhaHash },
    });

    // Adicionar ao histórico
    await this.prisma.historicoSenhaAluno.create({
      data: {
        id_aluno,
        senha_hash: novaSenhaHash,
      },
    });

    // Limpar histórico antigo (manter apenas as últimas 3)
    const todosHistoricos = await this.prisma.historicoSenhaAluno.findMany({
      where: { id_aluno },
      orderBy: { data_criacao: 'desc' },
    });

    if (todosHistoricos.length > this.PASSWORD_HISTORY_LIMIT) {
      const idsParaDeletar = todosHistoricos
        .slice(this.PASSWORD_HISTORY_LIMIT)
        .map((h) => h.id_historico);

      await this.prisma.historicoSenhaAluno.deleteMany({
        where: { id_historico: { in: idsParaDeletar } },
      });
    }

    // Log de auditoria
    this.auditService.logPasswordChanged(aluno.nome, aluno.id_aluno);

    return { message: 'Senha atualizada com sucesso' };
  }

  /**
   * Atualizar dados do aluno
   */
  async atualizarAluno(id: string, updateDto: AtualizarAlunoDto) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno: id },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
    }

    const updated = await this.prisma.aluno.update({
      where: { id_aluno: id },
      data: updateDto,
      include: {
        aptidoes: true,
        softskills: true,
      },
    });

    // Log de auditoria
    const updatedFields = Object.keys(updateDto);
    this.auditService.logUserUpdated(
      updated.nome,
      updated.id_aluno,
      updatedFields,
    );
    this.auditService.logStudentProfileUpdated(
      updated.nome,
      updated.id_aluno,
      updatedFields,
    );

    return updated;
  }

  /**
   * Excluir aluno
   */
  async excluirAluno(id: string) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno: id },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
    }

    await this.prisma.aluno.delete({
      where: { id_aluno: id },
    });

    // Log de auditoria
    this.auditService.logUserDeleted(aluno.nome, aluno.id_aluno, 'aluno');

    return { message: 'Aluno excluído com sucesso' };
  }
}
