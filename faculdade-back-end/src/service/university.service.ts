/**import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreatePerguntaDto } from "src/dto/faculdades/create-ask.dto";
import { CreateUniversityDto } from "src/dto/faculdades/create-university.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { AnswerQuestionDto } from "src/dto/faculdades/answer-question.dto";

@Injectable()
export class UniversityService {

    constructor(private prisma:PrismaService){}

    async createUniversity(createUniversity:CreateUniversityDto){
        return this.prisma.faculdade.create({
            data:{
                ...createUniversity,
            }
        })
    }

    async getAllUniversitys(){
        return this.prisma.faculdade.findMany();
    }


    async createAskAndOptions(createPerguntaDto: CreatePerguntaDto) {
        const { id_faculdade, enunciado, opcoes } = createPerguntaDto;
    
        return this.prisma.pergunta.create({
          data: {
            id_faculdade,
            enunciado,
            data_criação: new Date(),
            opcoes: {
              create: opcoes.map(opcao => ({
                texto_resposta: opcao.texto_resposta,
                correta: opcao.correta,
              })),
            },
          },
          include: {
            opcoes: true, 
          },
        });
      }

    async getUnansweredQuestions(userId: string) {
        // Busca todas as perguntas da faculdade do usuário
        const user = await this.prisma.usuario.findUnique({
            where: { id_usuario: userId },
            select: { id_faculdade: true }
        });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Busca todas as perguntas que o usuário já respondeu
        const answeredQuestions = await this.prisma.usuario_Acertos.findMany({
            where: { id_usuario: userId },
            select: { id_pergunta: true }
        });

        const answeredQuestionIds = answeredQuestions.map(q => q.id_pergunta);

        // Busca todas as perguntas da faculdade que o usuário ainda não respondeu
        return this.prisma.pergunta.findMany({
            where: {
                id_faculdade: user.id_faculdade,
                id_pergunta: {
                    notIn: answeredQuestionIds
                }
            },
            include: {
                opcoes: true
            }
        });
    }

    async answerQuestion(userId: string, answerDto: AnswerQuestionDto) {
        // Verifica se a pergunta existe
        const pergunta = await this.prisma.pergunta.findUnique({
            where: { id_pergunta: answerDto.id_pergunta },
            include: { opcoes: true }
        });

        if (!pergunta) {
            throw new NotFoundException('Pergunta não encontrada');
        }

        // Verifica se a opção de resposta existe e pertence à pergunta
        const opcaoResposta = pergunta.opcoes.find(
            opcao => opcao.id_opcao_resposta === answerDto.id_opcao_resposta
        );

        if (!opcaoResposta) {
            throw new BadRequestException('Opção de resposta inválida para esta pergunta');
        }

        // Verifica se o usuário já respondeu esta pergunta
        const respostaExistente = await this.prisma.usuario_Acertos.findFirst({
            where: {
                id_usuario: userId,
                id_pergunta: answerDto.id_pergunta
            }
        });

        if (respostaExistente) {
            throw new BadRequestException('Usuário já respondeu esta pergunta');
        }

        // Registra a resposta do usuário
        return this.prisma.usuario_Acertos.create({
            data: {
                id_usuario: userId,
                id_pergunta: answerDto.id_pergunta,
                id_opcao_resposta: answerDto.id_opcao_resposta,
                acertou: opcaoResposta.correta
            }
        });
    }

    async getQuestionById(id: string) {
        const question = await this.prisma.pergunta.findUnique({
            where: {
                id_pergunta: id,
            },
            include: {
                opcoes: true,
            },
        });

        if (!question) {
            throw new NotFoundException('Pergunta não encontrada');
        }

        return question;
    }
}**/