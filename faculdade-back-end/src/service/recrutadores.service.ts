import { ConflictException, Injectable, NotFoundException, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { CriarRecrutadorDto } from "src/dto/recrutadores/criarRecrutado.dto";
import { AtualizarRecrutadorDto } from "src/dto/recrutadores/atualizar-recrutador.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { compare, hash } from "bcryptjs";
import { loginRecrutadorDto } from "src/dto/recrutadores/login.dto";
import { JwtService } from "@nestjs/jwt";
import { OfertaContratacaoDto } from "src/dto/recrutadores/oferta-contratacao.dto";
import { AuditService } from "./audit.service";

@Injectable()
export class RecrutadoresService {
    private readonly MAX_LOGIN_ATTEMPTS = 5;
    private readonly LOCKOUT_DURATION_MINUTES = 10;
    private readonly PASSWORD_HISTORY_LIMIT = 3;

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private auditService: AuditService,
    ){}

    async createRecrutador(createRecrutadorDto: CriarRecrutadorDto) {
        await this.validarRecrutadorExistente(createRecrutadorDto.email);

        const passwordHash = await hash(createRecrutadorDto.senha, 8);

        const recrutador = await this.prisma.recrutador.create({
            data: {
                ...createRecrutadorDto,
                senha: passwordHash,
            }
        });

        // Adicionar senha ao histórico
        await this.prisma.historicoSenhaRecrutador.create({
            data: {
                id_recrutador: recrutador.id_recrutador,
                senha_hash: passwordHash,
            }
        });

        // Log de auditoria
        this.auditService.logUserCreated(recrutador.nome, recrutador.id_recrutador, 'recrutador');

        return recrutador;
    }

    private async validarRecrutadorExistente(email: string){
        const recrutador = await this.prisma.recrutador.findUnique({
            where: { email }
        });
        if (recrutador) {
            throw new ConflictException('Recrutador já cadastrado');
        }
    }

    async validateRecrutador(email: string, senha: string): Promise<any> {
        const recrutador = await this.prisma.recrutador.findUnique({
            where: { email }
        });
        if (!recrutador) {
            this.auditService.logAuthFailure(email, 'Usuário não encontrado');
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // Verificar se a conta está bloqueada
        if (recrutador.bloqueado_ate) {
            const now = new Date();
            if (now < recrutador.bloqueado_ate) {
                const minutosRestantes = Math.ceil(
                    (recrutador.bloqueado_ate.getTime() - now.getTime()) / (1000 * 60)
                );
                this.auditService.logAccountLocked(
                    recrutador.nome,
                    recrutador.id_recrutador,
                    `Tentativa de acesso com conta bloqueada. ${minutosRestantes} minuto(s) restante(s)`
                );
                throw new UnauthorizedException(
                    `Conta bloqueada. Tente novamente em ${minutosRestantes} minuto(s)`
                );
            } else {
                // Desbloqueio automático se o tempo passou
                await this.prisma.recrutador.update({
                    where: { id_recrutador: recrutador.id_recrutador },
                    data: {
                        bloqueado_ate: null,
                        tentativas_login: 0,
                    }
                });
            }
        }

        const passwordMatch = await compare(senha, recrutador.senha);
        if (!passwordMatch) {
            // Incrementar tentativas de login
            const novasTentativas = recrutador.tentativas_login + 1;

            if (novasTentativas >= this.MAX_LOGIN_ATTEMPTS) {
                // Bloquear a conta
                const bloqueadoAte = new Date();
                bloqueadoAte.setMinutes(bloqueadoAte.getMinutes() + this.LOCKOUT_DURATION_MINUTES);

                await this.prisma.recrutador.update({
                    where: { id_recrutador: recrutador.id_recrutador },
                    data: {
                        tentativas_login: novasTentativas,
                        bloqueado_ate: bloqueadoAte,
                    }
                });

                // Log de múltiplas falhas e bloqueio
                this.auditService.logMultipleAuthFailures(recrutador.nome, novasTentativas);
                this.auditService.logAccountLocked(
                    recrutador.nome,
                    recrutador.id_recrutador,
                    `Conta bloqueada após ${this.MAX_LOGIN_ATTEMPTS} tentativas falhas`
                );

                throw new UnauthorizedException(
                    `Conta bloqueada por ${this.LOCKOUT_DURATION_MINUTES} minutos após ${this.MAX_LOGIN_ATTEMPTS} tentativas falhas`
                );
            } else {
                // Apenas incrementar tentativas
                await this.prisma.recrutador.update({
                    where: { id_recrutador: recrutador.id_recrutador },
                    data: { tentativas_login: novasTentativas }
                });

                // Log de falha de autenticação
                this.auditService.logAuthFailure(
                    recrutador.nome,
                    `Senha incorreta. Tentativa ${novasTentativas} de ${this.MAX_LOGIN_ATTEMPTS}`
                );

                const tentativasRestantes = this.MAX_LOGIN_ATTEMPTS - novasTentativas;
                throw new UnauthorizedException(
                    `Credenciais inválidas. ${tentativasRestantes} tentativa(s) restante(s)`
                );
            }
        }

        // Login bem-sucedido - resetar tentativas
        if (recrutador.tentativas_login > 0) {
            await this.prisma.recrutador.update({
                where: { id_recrutador: recrutador.id_recrutador },
                data: { tentativas_login: 0 }
            });
        }

        const { senha: _, ...result } = recrutador;
        return result;
    }
    

    async login(loginDto: loginRecrutadorDto) {
        const recrutador = await this.validateRecrutador(loginDto.email, loginDto.senha);

        const payload = { 
            email: recrutador.email, 
            sub: recrutador.id_recrutador,
            nome: recrutador.nome,
            id_empresa: recrutador.id_empresa
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id_recrutador: recrutador.id_recrutador,
                nome: recrutador.nome,
                email: recrutador.email,
                id_empresa: recrutador.id_empresa
            }
        };
    }

    async getRecrutador(id: string){
        const recrutador = await this.prisma.recrutador.findUnique({
            where: { id_recrutador: id }
        });
        if (!recrutador) {
            throw new NotFoundException('Recrutador não encontrado');
        }
        return recrutador;
    }

    async getAllRecrutadores(){
        return this.prisma.recrutador.findMany();
    }

    /**
     * Valida se a nova senha não está no histórico das últimas 3 senhas
     */
    private async validarHistoricoSenha(id_recrutador: string, novaSenha: string): Promise<void> {
        // Buscar as últimas 3 senhas do histórico
        const historico = await this.prisma.historicoSenhaRecrutador.findMany({
            where: { id_recrutador },
            orderBy: { data_criacao: 'desc' },
            take: this.PASSWORD_HISTORY_LIMIT,
        });

        // Verificar se a nova senha é igual a alguma das últimas 3
        for (const registro of historico) {
            const senhaIgual = await compare(novaSenha, registro.senha_hash);
            if (senhaIgual) {
                throw new BadRequestException(
                    'A nova senha não pode ser igual a nenhuma das últimas 3 senhas utilizadas'
                );
            }
        }
    }

    /**
     * Atualiza a senha do recrutador
     */
    async atualizarSenha(id_recrutador: string, senhaAtual: string, novaSenha: string) {
        const recrutador = await this.prisma.recrutador.findUnique({
            where: { id_recrutador }
        });

        if (!recrutador) {
            throw new NotFoundException('Recrutador não encontrado');
        }

        // Validar senha atual
        const senhaAtualValida = await compare(senhaAtual, recrutador.senha);
        if (!senhaAtualValida) {
            throw new UnauthorizedException('Senha atual incorreta');
        }

        // Validar histórico de senhas
        await this.validarHistoricoSenha(id_recrutador, novaSenha);

        // Hashear nova senha
        const novaSenhaHash = await hash(novaSenha, 8);

        // Atualizar senha
        await this.prisma.recrutador.update({
            where: { id_recrutador },
            data: { senha: novaSenhaHash }
        });

        // Adicionar ao histórico
        await this.prisma.historicoSenhaRecrutador.create({
            data: {
                id_recrutador,
                senha_hash: novaSenhaHash,
            }
        });

        // Limpar histórico antigo (manter apenas as últimas 3)
        const todosHistoricos = await this.prisma.historicoSenhaRecrutador.findMany({
            where: { id_recrutador },
            orderBy: { data_criacao: 'desc' },
        });

        if (todosHistoricos.length > this.PASSWORD_HISTORY_LIMIT) {
            const idsParaDeletar = todosHistoricos
                .slice(this.PASSWORD_HISTORY_LIMIT)
                .map(h => h.id_historico);

            await this.prisma.historicoSenhaRecrutador.deleteMany({
                where: { id_historico: { in: idsParaDeletar } }
            });
        }

        return { message: 'Senha atualizada com sucesso' };
    }

    async oferecerContratacao(id_recrutador: string, ofertaDto: OfertaContratacaoDto) {
        // Verificar se o aluno existe
        const aluno = await this.prisma.aluno.findUnique({
            where: { id_aluno: ofertaDto.id_aluno }
        });

        if (!aluno) {
            throw new NotFoundException('Aluno não encontrado');
        }

        // Criar a contratação
        const contratacao = await this.prisma.contratacao.create({
            data: {
                id_recrutador,
                id_aluno: ofertaDto.id_aluno,
                cargo: ofertaDto.cargo,
                salario: ofertaDto.salario,
                status: "PENDENTE"
            },
            include: {
                aluno: {
                    select: {
                        nome: true,
                        email: true,
                        curso: true
                    }
                }
            }
        });

        // Incrementar o contador de solicitações do aluno
        await this.prisma.aluno.update({
            where: { id_aluno: ofertaDto.id_aluno },
            data: { solicitacoes: { increment: 1 } }
        });

        // Log de auditoria - Evento customizado
        const recrutador = await this.prisma.recrutador.findUnique({
            where: { id_recrutador }
        });
        if (recrutador) {
            this.auditService.logJobOfferCreated(
                recrutador.nome,
                aluno.nome,
                ofertaDto.cargo,
                ofertaDto.salario?.toString() || 'Não informado'
            );
        }

        return contratacao;
    }

    /**
     * Atualizar dados do recrutador
     */
    async atualizarRecrutador(id: string, updateDto: AtualizarRecrutadorDto) {
        const recrutador = await this.prisma.recrutador.findUnique({
            where: { id_recrutador: id }
        });

        if (!recrutador) {
            throw new NotFoundException('Recrutador não encontrado');
        }

        const updated = await this.prisma.recrutador.update({
            where: { id_recrutador: id },
            data: updateDto
        });

        // Log de auditoria
        const updatedFields = Object.keys(updateDto);
        this.auditService.logUserUpdated(updated.nome, updated.id_recrutador, updatedFields);

        return updated;
    }

    /**
     * Excluir recrutador
     */
    async excluirRecrutador(id: string) {
        const recrutador = await this.prisma.recrutador.findUnique({
            where: { id_recrutador: id }
        });

        if (!recrutador) {
            throw new NotFoundException('Recrutador não encontrado');
        }

        await this.prisma.recrutador.delete({
            where: { id_recrutador: id }
        });

        // Log de auditoria
        this.auditService.logUserDeleted(recrutador.nome, recrutador.id_recrutador, 'recrutador');

        return { message: 'Recrutador excluído com sucesso' };
    }
}
