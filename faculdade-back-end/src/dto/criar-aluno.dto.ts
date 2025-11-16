import { IsString, IsEmail, IsInt, IsDate, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CriarAptidaoDto } from './criar-aptidao.dto';
import { CriarSoftSkillsDto } from './criar-softskills.dto';
import { IsStrongPassword } from '../validators/strong-password.validator';

export class CriarAlunoDto {
    @IsString()
    nome: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsStrongPassword()
    senha: string;

    @IsString()
    matricula: string;

    @IsString()
    curso: string;

    @IsInt()
    semestre_atual: number;

    @IsString()
    cpf: string;

    @IsString()
    telefone: string;

    @IsDate()
    @Type(() => Date)
    data_nascimento: Date;

    @IsString()
    endereco: string;

    @IsString()
    @IsOptional()
    linkedin?: string;

    @IsString()
    @IsOptional()
    github?: string;

    @IsString()
    @IsOptional()
    portfolio?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CriarAptidaoDto)
    aptidoes: CriarAptidaoDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CriarSoftSkillsDto)
    softskills: CriarSoftSkillsDto[];
} 