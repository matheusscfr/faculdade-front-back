import { PrismaClient } from '../../generated/prisma';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Função auxiliar para log de auditoria
function logCompanyCreated(companyName: string, creatorName: string = 'Sistema') {
  const logDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logDir, 'audit.log');

  // Criar diretório de logs se não existir
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    eventType: 'EMPRESA_CRIADA',
    userName: creatorName,
    description: `Nova empresa criada: ${companyName}`,
    additionalData: {
      companyName,
      createdBy: creatorName,
    },
  };

  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
}

const empresasData = [
  {
    nome: 'Tech Solutions Brasil',
    cnpj: '12345678000190',
    endereco: 'Av. Paulista, 1000 - São Paulo/SP',
    setor: 'Tecnologia',
    descricao: 'Empresa de desenvolvimento de software e consultoria em TI',
    website: 'https://techsolutions.com.br',
  },
  {
    nome: 'Inovação Digital Ltda',
    cnpj: '98765432000185',
    endereco: 'Rua do Comércio, 500 - Recife/PE',
    setor: 'Tecnologia',
    descricao: 'Startup focada em soluções digitais e transformação digital',
    website: 'https://inovacaodigital.com.br',
  },
  {
    nome: 'CodeMasters Academy',
    cnpj: '11223344000155',
    endereco: 'Av. Boa Viagem, 2500 - Recife/PE',
    setor: 'Educação',
    descricao: 'Plataforma de ensino de programação e desenvolvimento de software',
    website: 'https://codemasters.edu.br',
  },
];

export async function seedEmpresas() {
  console.log('🌱 Iniciando seed de empresas...');

  try {
    for (const empresaData of empresasData) {
      // Verificar se a empresa já existe pelo CNPJ
      const empresaExistente = await prisma.empresa.findUnique({
        where: { cnpj: empresaData.cnpj },
      });

      if (!empresaExistente) {
        const empresa = await prisma.empresa.create({
          data: empresaData,
        });
        console.log(`✅ Empresa criada: ${empresa.nome} (CNPJ: ${empresa.cnpj})`);

        // Log de auditoria
        logCompanyCreated(empresa.nome, 'Sistema de Seed');
      } else {
        console.log(`ℹ️  Empresa já existe: ${empresaExistente.nome} (CNPJ: ${empresaExistente.cnpj})`);
      }
    }

    console.log('✅ Seed de empresas concluído!');
  } catch (error) {
    console.error('❌ Erro ao executar seed de empresas:', error);
    throw error;
  }
}

// Permitir executar o seed diretamente
if (require.main === module) {
  seedEmpresas()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
