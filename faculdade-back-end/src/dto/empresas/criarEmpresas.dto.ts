import { IsNotEmpty, Matches } from "class-validator";

import { IsString } from "class-validator";

export class CriarEmpresaDto {

    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{14}$/, { message: 'CNPJ deve conter 14 dígitos' })
    cnpj: string;

    @IsString()
    @IsNotEmpty()
    endereco: string;

    @IsString()
    @IsNotEmpty()
    setor: string;

    @IsString()
    descricao: string;

    @IsString()
    website: string;

}
    
    
