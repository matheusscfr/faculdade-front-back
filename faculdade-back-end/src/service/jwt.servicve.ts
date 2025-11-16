
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'seuSegredoSuperSecreto',
    });
  }

  async validate(payload: any) {
    const recrutador = await this.prisma.recrutador.findUnique({
      where: { id_recrutador: payload.sub },
    });

    if (!recrutador) {
      throw new UnauthorizedException('Recrutador não encontrado');
    }

    const { senha, ...result } = recrutador; 
    return result;
  }
}