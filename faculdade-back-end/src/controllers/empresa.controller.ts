import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { CriarEmpresaDto } from "src/dto/empresas/criarEmpresas.dto";
import { EmpresasService } from "src/service/empresas.service";


@Controller('empresa')
export class EmpresaController {

    constructor(private readonly empresaService: EmpresasService) {}

    @Get()
    @HttpCode(200)
    async listarTodasEmpresas() {
        return this.empresaService.listarTodasEmpresas();
    }

    @Get(':id')
    @HttpCode(200)
    async listarUmaEmpresa(@Param('id') id: string) {
        return this.empresaService.listarUmaEmpresa(id);
    }

    @Post()
    @HttpCode(201)
    async criarEmpresa(@Body() createEmpresaDto: CriarEmpresaDto) {
        return this.empresaService.criarEmpresa(createEmpresaDto);
    }
}