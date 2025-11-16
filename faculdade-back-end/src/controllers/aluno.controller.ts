import { Controller, Post, Body, HttpCode, Param, Get, Patch, Delete, UseGuards } from '@nestjs/common';
import { AlunoService } from '../service/aluno.service';
import { CriarAlunoDto } from '../dto/criar-aluno.dto';
import { CriarListaAlunosDto } from '../dto/criar-lista-alunos.dto';
import { AtualizarSenhaAlunoDto } from '../dto/atualizar-senha-aluno.dto';
import { AtualizarAlunoDto } from '../dto/atualizar-aluno.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('aluno')
export class AlunoController {
    constructor(private readonly alunoService: AlunoService) {}

    @Post()
    @HttpCode(201)
    async criarAlunos(@Body() createListaAlunosDto: CriarListaAlunosDto) {
        return this.alunoService.criarListaAlunos(createListaAlunosDto);
    }

    @Get(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    async listarAluno(@Param('id') id: string) {
        return this.alunoService.listarAluno(id);
    }

    @Get()
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    async listarTodosAlunos() {
        return this.alunoService.listarTodosAlunos();
    }

    @Patch(':id/senha')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    async atualizarSenha(
        @Param('id') id: string,
        @Body() atualizarSenhaDto: AtualizarSenhaAlunoDto
    ) {
        return this.alunoService.atualizarSenha(
            id,
            atualizarSenhaDto.senhaAtual,
            atualizarSenhaDto.novaSenha
        );
    }

    @Patch(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    async atualizarAluno(
        @Param('id') id: string,
        @Body() updateDto: AtualizarAlunoDto
    ) {
        return this.alunoService.atualizarAluno(id, updateDto);
    }

    @Delete(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    async excluirAluno(@Param('id') id: string) {
        return this.alunoService.excluirAluno(id);
    }
} 