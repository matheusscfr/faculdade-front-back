import { IsNotEmpty, IsString } from "class-validator";
import { IsStrongPassword } from "../validators/strong-password.validator";

export class AtualizarSenhaAlunoDto {
    @IsNotEmpty()
    @IsString()
    senhaAtual: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    novaSenha: string;
}
