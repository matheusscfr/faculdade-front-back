import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CriarSoftSkillsDto {
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