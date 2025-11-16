import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateUserDto{   
    @IsNotEmpty() 
    @IsString()
    nome: string;

    @IsNotEmpty() 
    @IsString()
    email: string;

    @IsNotEmpty() 
    @IsString()
    senha: string;

    @IsString()
    id_faculdade: string;
}