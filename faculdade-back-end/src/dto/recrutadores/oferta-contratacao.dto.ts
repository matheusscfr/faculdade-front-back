import { IsString, IsNumber, IsOptional } from 'class-validator';

export class OfertaContratacaoDto {
    @IsString()
    id_aluno: string;

    @IsString()
    cargo: string;

    @IsNumber()
    @IsOptional()
    salario?: number;
} 