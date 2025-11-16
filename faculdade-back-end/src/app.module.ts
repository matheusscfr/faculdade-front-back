import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from './prisma/prisma.service';
import { LocalStrategy } from './local-strategy.service';
import { JwtStrategy } from './service/jwt.servicve';
import { RecrutadoresService } from './service/recrutadores.service';
import { RecrutadoresController } from './controllers/recrutadores.controller';
import { EmpresaController } from './controllers/empresa.controller';
import { EmpresasService } from './service/empresas.service';
import { AlunoController } from './controllers/aluno.controller';
import { AlunoService } from './service/aluno.service';
import { AuditService } from './service/audit.service';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'seuSegredoSuperSecreto',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [RecrutadoresController, EmpresaController, AlunoController],
  providers: [
    PrismaService,
    RecrutadoresService,
    LocalStrategy,
    JwtStrategy,
    EmpresasService,
    AlunoService,
    AuditService,
  ],
})
export class AppModule {}
