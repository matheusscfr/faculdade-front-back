import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CriarEmpresaDto } from "src/dto/empresas/criarEmpresas.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class EmpresasService {

    constructor(private prisma: PrismaService) {}

    async listarTodasEmpresas() {
        return this.prisma.empresa.findMany();
    }

    async listarUmaEmpresa(id: string) {
        const empresa =  this.prisma.empresa.findUnique({
            where: { id_empresa: id }
        });
        
        if (!empresa) {
            throw new NotFoundException('Empresa não encontrada');
        }
        return empresa;
    }

    async criarEmpresa(createEmpresaDto: CriarEmpresaDto) {
        await this.validarEmpresaExistente(createEmpresaDto.cnpj);

        return this.prisma.empresa.create({
            data: createEmpresaDto
        });
    }

    async validarEmpresaExistente(cnpj: string) {
        const empresa = await this.prisma.empresa.findUnique({
            where: { cnpj }
        });
        if (empresa) {
            throw new ConflictException('Empresa já cadastrada');
        }
    }
}
    