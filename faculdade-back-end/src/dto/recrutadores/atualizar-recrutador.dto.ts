import { IsOptional, IsString } from "class-validator";

export class AtualizarRecrutadorDto {
    @IsOptional()
    @IsString()
    nome?: string;

    @IsOptional()
    @IsString()
    cargo?: string;

    @IsOptional()
    @IsString()
    telefone?: string;
}
