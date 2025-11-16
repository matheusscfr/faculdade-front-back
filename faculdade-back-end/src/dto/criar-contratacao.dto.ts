import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CriarContratacaoDto {
    @IsString()
    id_aluno: string;

    @IsString()
    cargo: string;

    @IsNumber()
    @IsOptional()
    salario?: number;
} 