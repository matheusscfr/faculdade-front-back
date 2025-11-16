// src/perguntas/dto/create-pergunta.dto.ts

import { IsArray, IsBoolean, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOpcaoRespostaDto {

  @IsString()
  @IsNotEmpty()
  texto_resposta: string;

  @IsBoolean()
  correta: boolean;
}

export class CreatePerguntaDto {
  @IsUUID()
  id_faculdade: string;

  @IsString()
  @IsNotEmpty()
  enunciado: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOpcaoRespostaDto)
  opcoes: CreateOpcaoRespostaDto[];
}