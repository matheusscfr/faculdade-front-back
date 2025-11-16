import { IsNotEmpty, IsString } from "class-validator";

export class CreateUniversityDto {
    @IsString()
    @IsNotEmpty()
    nome: string;
    
    @IsString()
    endereco: string;
}