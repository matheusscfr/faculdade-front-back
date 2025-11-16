import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class AnswerQuestionDto {
    @IsUUID()
    @IsNotEmpty()
    id_pergunta: string;

    @IsUUID()
    @IsNotEmpty()
    id_opcao_resposta: string;
} 