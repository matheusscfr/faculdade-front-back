import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CriarAlunoDto } from './criar-aluno.dto';

export class CriarListaAlunosDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CriarAlunoDto)
    alunos: CriarAlunoDto[];
} 