
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { RecrutadoresService } from './service/recrutadores.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: RecrutadoresService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const recrutador = await this.authService.validateRecrutador(email, password);
    if (!recrutador) {
      throw new UnauthorizedException();
    }
    return recrutador;
  }
}