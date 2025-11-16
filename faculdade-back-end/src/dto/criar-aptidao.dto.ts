import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CriarAptidaoDto {
    @IsString()
    nome: string;

    @IsInt()
    @Min(1)
    @Max(5)
    nivel: number;

    @IsString()
    @IsOptional()
    descricao?: string;
} 