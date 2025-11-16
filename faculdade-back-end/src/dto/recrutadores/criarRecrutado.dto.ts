import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { IsStrongPassword } from 'src/validators/strong-password.validator';

export class CriarRecrutadorDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  senha: string;

  @IsNotEmpty()
  @IsString()
  cargo: string;

  @IsNotEmpty()
  @IsString()
  telefone: string;

  @IsString()
  id_empresa: string;
}
