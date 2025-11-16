import { IsEmail } from "class-validator";

import { IsNotEmpty } from "class-validator";

import { IsString } from "class-validator";

export class loginRecrutadorDto{

    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    senha: string;
}