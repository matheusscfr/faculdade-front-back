import { IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from 'src/validators/strong-password.validator';

export class AtualizarSenhaDto {
  @IsNotEmpty()
  @IsString()
  senhaAtual: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  novaSenha: string;
}
