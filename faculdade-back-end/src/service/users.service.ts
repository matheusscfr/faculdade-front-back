/**import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { compare, hash } from "bcryptjs";
import { CreateUserDto } from "src/dto/users/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from "src/dto/users/login-user.dto";

@Injectable()
export class UsersService{

    constructor(private prisma: PrismaService,
      private jwtService: JwtService,
    ){}

    async createUser(createUserDto: CreateUserDto){
     await this.validarUsuarioExistente(createUserDto.email);

      const passwordHash = await hash(createUserDto.senha, 8);
     return this.prisma.usuario.create({
        data:{
            ...createUserDto,
            senha: passwordHash,
        }
     });
        
    }

    private async validarUsuarioExistente(email: string){
        const usuario = await this.prisma.usuario.findUnique({
            where: {
              email: email,
            },
          });
        
          if (usuario) {
            throw new ConflictException('Usuário com esse e-mail já existe.');
          }
    }

    async validateUser(email: string, senha: string): Promise<any> {
      const user = await this.prisma.usuario.findUnique({
        where: { email },
      });
  
      if (!user) {
        throw new UnauthorizedException('Credenciais inválidas');
      }
  
      const passwordMatch = await compare(senha, user.senha);
  
      if (!passwordMatch) {
        throw new UnauthorizedException('Credenciais inválidas');
      }
  
      const { senha: _, ...result } = user;
      return result;
    }
  
    async login(loginDto: LoginDto) {
      const user = await this.validateUser(loginDto.email, loginDto.senha);
  
      const payload = { 
        email: user.email, 
        sub: user.id_usuario,
        nome: user.nome,
        id_faculdade: user.id_faculdade
      };
  
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id_usuario: user.id_usuario,
          nome: user.nome,
          email: user.email,
          id_faculdade: user.id_faculdade
        }
      };
    }

    async getUser(id: string){
      return this.prisma.usuario.findUnique({
        where: {
          id_usuario: id
        }
      });
    }
    
}**/