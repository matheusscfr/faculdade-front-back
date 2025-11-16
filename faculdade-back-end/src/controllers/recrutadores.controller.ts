import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CriarRecrutadorDto } from 'src/dto/recrutadores/criarRecrutado.dto';
import { loginRecrutadorDto } from 'src/dto/recrutadores/login.dto';
import { LoginDto } from 'src/dto/users/login-user.dto';
import { OfertaContratacaoDto } from 'src/dto/recrutadores/oferta-contratacao.dto';
import { AtualizarSenhaDto } from 'src/dto/recrutadores/atualizar-senha.dto';
import { AtualizarRecrutadorDto } from 'src/dto/recrutadores/atualizar-recrutador.dto';
import { RecrutadoresService } from 'src/service/recrutadores.service';

@Controller('recrutadores')
export class RecrutadoresController {
  constructor(private readonly recrutadoresService: RecrutadoresService) {}

  @Post()
  @HttpCode(201)
  async createRecrutador(@Body() createRecrutadorDto: CriarRecrutadorDto) {
    return this.recrutadoresService.createRecrutador(createRecrutadorDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: loginRecrutadorDto) {
    return this.recrutadoresService.login(loginDto);
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async getRecrutador(@Param('id') id: string) {
    return this.recrutadoresService.getRecrutador(id);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async getAllRecrutadores() {
    return this.recrutadoresService.getAllRecrutadores();
  }

  @Post('oferta-contratacao/:id_recrutador')
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'))
  async oferecerContratacao(
    @Param('id_recrutador') id_recrutador: string,
    @Body() ofertaDto: OfertaContratacaoDto,
  ) {
    return this.recrutadoresService.oferecerContratacao(
      id_recrutador,
      ofertaDto,
    );
  }

  @Patch(':id/senha')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async atualizarSenha(
    @Param('id') id: string,
    @Body() atualizarSenhaDto: AtualizarSenhaDto,
  ) {
    return this.recrutadoresService.atualizarSenha(
      id,
      atualizarSenhaDto.senhaAtual,
      atualizarSenhaDto.novaSenha,
    );
  }

  @Patch(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async atualizarRecrutador(
    @Param('id') id: string,
    @Body() updateDto: AtualizarRecrutadorDto,
  ) {
    return this.recrutadoresService.atualizarRecrutador(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async excluirRecrutador(@Param('id') id: string) {
    return this.recrutadoresService.excluirRecrutador(id);
  }
}
