import { PrismaClient } from '../../generated/prisma';
import * as fs from 'fs';
import * as path from 'path';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Função auxiliar para log de auditoria
function logCompanyCreated(
  companyName: string,
  creatorName: string = 'Sistema',
) {
  const logDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logDir, 'audit.log');

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
    descricao:
      'Plataforma de ensino de programação e desenvolvimento de software',
    website: 'https://codemasters.edu.br',
  },
];

// Dados variados para alunos
const cursos = [
  'Ciência da Computação',
  'Engenharia de Software',
  'Sistemas de Informação',
  'Análise e Desenvolvimento de Sistemas',
  'Engenharia da Computação',
  'Tecnologia da Informação',
];

const disciplinas = [
  'Algoritmos e Estruturas de Dados',
  'Programação Orientada a Objetos',
  'Banco de Dados',
  'Desenvolvimento Web',
  'Engenharia de Software',
  'Redes de Computadores',
  'Inteligência Artificial',
  'Segurança da Informação',
  'Sistemas Operacionais',
  'Compiladores',
  'Arquitetura de Computadores',
  'Interface Humano-Computador',
  'Testes de Software',
  'DevOps',
  'Cloud Computing',
  'Mobile Development',
  'Machine Learning',
  'Big Data',
];

const tecnologias = [
  {
    nome: 'JavaScript',
    descricao: 'Linguagem de programação para desenvolvimento web',
  },
  {
    nome: 'TypeScript',
    descricao: 'Superset do JavaScript com tipagem estática',
  },
  {
    nome: 'Python',
    descricao: 'Linguagem versátil para desenvolvimento e ciência de dados',
  },
  {
    nome: 'Java',
    descricao: 'Linguagem orientada a objetos para aplicações enterprise',
  },
  {
    nome: 'React',
    descricao: 'Biblioteca JavaScript para construção de interfaces',
  },
  { nome: 'Node.js', descricao: 'Runtime JavaScript para backend' },
  { nome: 'Vue.js', descricao: 'Framework JavaScript progressivo' },
  { nome: 'Angular', descricao: 'Framework TypeScript para aplicações web' },
  {
    nome: 'PostgreSQL',
    descricao: 'Sistema de gerenciamento de banco de dados relacional',
  },
  { nome: 'MongoDB', descricao: 'Banco de dados NoSQL orientado a documentos' },
  { nome: 'Docker', descricao: 'Plataforma de containerização' },
  { nome: 'Kubernetes', descricao: 'Orquestração de containers' },
  { nome: 'AWS', descricao: 'Serviços de cloud computing da Amazon' },
  { nome: 'Git', descricao: 'Sistema de controle de versão' },
  { nome: 'Linux', descricao: 'Sistema operacional open source' },
  { nome: 'REST API', descricao: 'Arquitetura para desenvolvimento de APIs' },
  { nome: 'GraphQL', descricao: 'Linguagem de consulta para APIs' },
  { nome: 'Microservices', descricao: 'Arquitetura de software distribuída' },
];

const softSkills = [
  {
    nome: 'Comunicação',
    descricao: 'Habilidade de transmitir ideias de forma clara e eficaz',
  },
  {
    nome: 'Trabalho em Equipe',
    descricao: 'Capacidade de colaborar efetivamente em grupos',
  },
  { nome: 'Liderança', descricao: 'Habilidade de guiar e motivar equipes' },
  {
    nome: 'Resolução de Problemas',
    descricao: 'Capacidade de analisar e resolver desafios complexos',
  },
  {
    nome: 'Pensamento Crítico',
    descricao: 'Análise objetiva e avaliação de situações',
  },
  {
    nome: 'Adaptabilidade',
    descricao: 'Flexibilidade para lidar com mudanças',
  },
  {
    nome: 'Gestão de Tempo',
    descricao: 'Organização eficiente de tarefas e prazos',
  },
  { nome: 'Criatividade', descricao: 'Capacidade de gerar ideias inovadoras' },
  { nome: 'Proatividade', descricao: 'Iniciativa para antecipar necessidades' },
  { nome: 'Empatia', descricao: 'Compreensão das perspectivas dos outros' },
];

// Função para gerar CPF aleatório
function gerarCPF(): string {
  const n1 = Math.floor(Math.random() * 9);
  const n2 = Math.floor(Math.random() * 9);
  const n3 = Math.floor(Math.random() * 9);
  const n4 = Math.floor(Math.random() * 9);
  const n5 = Math.floor(Math.random() * 9);
  const n6 = Math.floor(Math.random() * 9);
  const n7 = Math.floor(Math.random() * 9);
  const n8 = Math.floor(Math.random() * 9);
  const n9 = Math.floor(Math.random() * 9);
  return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-00`;
}

// Função para gerar data de nascimento (entre 18 e 30 anos)
function gerarDataNascimento(): Date {
  const hoje = new Date();
  const idadeMin = 18;
  const idadeMax = 30;
  const idade =
    Math.floor(Math.random() * (idadeMax - idadeMin + 1)) + idadeMin;
  const ano = hoje.getFullYear() - idade;
  const mes = Math.floor(Math.random() * 12);
  const dia = Math.floor(Math.random() * 28) + 1;
  return new Date(ano, mes, dia);
}

// Função para gerar nota aleatória (entre 5.0 e 10.0)
function gerarNota(): number {
  return Math.round((Math.random() * 5 + 5) * 10) / 10;
}

// Função para gerar nível aleatório (1-5)
function gerarNivel(): number {
  return Math.floor(Math.random() * 5) + 1;
}

// Função para selecionar elementos aleatórios de um array
function selecionarAleatorio<T>(array: T[], quantidade: number): T[] {
  const copia = [...array];
  const selecionados: T[] = [];
  for (let i = 0; i < quantidade && copia.length > 0; i++) {
    const indice = Math.floor(Math.random() * copia.length);
    selecionados.push(copia.splice(indice, 1)[0]);
  }
  return selecionados;
}

export async function seedEmpresas() {
  console.log('🌱 Iniciando seed de empresas...');

  try {
    for (const empresaData of empresasData) {
      const empresaExistente = await prisma.empresa.findUnique({
        where: { cnpj: empresaData.cnpj },
      });

      if (!empresaExistente) {
        const empresa = await prisma.empresa.create({
          data: empresaData,
        });
        console.log(
          `✅ Empresa criada: ${empresa.nome} (CNPJ: ${empresa.cnpj})`,
        );
        logCompanyCreated(empresa.nome, 'Sistema de Seed');
      } else {
        console.log(
          `ℹ️  Empresa já existe: ${empresaExistente.nome} (CNPJ: ${empresaExistente.cnpj})`,
        );
      }
    }

    console.log('✅ Seed de empresas concluído!');
  } catch (error) {
    console.error('❌ Erro ao executar seed de empresas:', error);
    throw error;
  }
}

export async function seedAlunos() {
  console.log('🌱 Iniciando seed de alunos...');

  const senhaHash = await hash('123456', 8); // Senha padrão para todos os alunos de seed
  const alunosCriados: string[] = [];

  try {
    // Criar 50 alunos variados
    for (let i = 1; i <= 50; i++) {
      const curso = cursos[Math.floor(Math.random() * cursos.length)];
      const semestre = Math.floor(Math.random() * 8) + 1;
      const dataNascimento = gerarDataNascimento();
      const cpf = gerarCPF();
      const matricula = `202${Math.floor(Math.random() * 4)}${String(i).padStart(4, '0')}`;
      const email = `aluno${i}@faculdade.edu.br`;

      // Verificar se já existe
      const alunoExistente = await prisma.aluno.findUnique({
        where: { email },
      });

      if (alunoExistente) {
        console.log(`ℹ️  Aluno já existe: ${email}`);
        alunosCriados.push(alunoExistente.id_aluno);
        continue;
      }

      const nomes = [
        'Ana Silva',
        'Bruno Santos',
        'Carlos Oliveira',
        'Diana Costa',
        'Eduardo Lima',
        'Fernanda Souza',
        'Gabriel Alves',
        'Helena Martins',
        'Igor Pereira',
        'Julia Ferreira',
        'Lucas Rodrigues',
        'Mariana Gomes',
        'Nicolas Ribeiro',
        'Olivia Carvalho',
        'Pedro Araújo',
        'Quésia Barbosa',
        'Rafael Cunha',
        'Sofia Dias',
        'Thiago Freitas',
        'Valentina Nunes',
        'Wagner Monteiro',
        'Ximena Cardoso',
        'Yuri Moura',
        'Zara Teixeira',
        'André Rocha',
        'Beatriz Moreira',
        'Caio Melo',
        'Daniela Castro',
        'Erick Ramos',
        'Flávia Rezende',
        'Gustavo Farias',
        'Hannah Mendes',
        'Ivan Pires',
        'Jéssica Machado',
        'Kauã Lopes',
        'Larissa Azevedo',
        'Marcos Correia',
        'Natália Barros',
        'Otávio Campos',
        'Paula Duarte',
        'Rafaela Vieira',
        'Samuel Nascimento',
        'Tatiana Guimarães',
        'Ulisses Dantas',
        'Vanessa Coelho',
        'William Pinheiro',
        'Yasmin Siqueira',
        'Zé Ricardo',
        'Amanda Torres',
        'Breno Leal',
      ];

      const nome = nomes[i - 1] || `Aluno ${i}`;
      const telefone = `(81) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
      const endereco = `Rua ${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}, ${Math.floor(Math.random() * 999) + 1} - Recife/PE`;

      // Perfis variados de GitHub/LinkedIn/Portfolio
      const temGitHub = Math.random() > 0.3;
      const temLinkedIn = Math.random() > 0.2;
      const temPortfolio = Math.random() > 0.5;

      const aluno = await prisma.aluno.create({
        data: {
          nome,
          email,
          senha: senhaHash,
          matricula,
          curso,
          semestre_atual: semestre,
          cpf,
          telefone,
          data_nascimento: dataNascimento,
          endereco,
          linkedin: temLinkedIn
            ? `https://linkedin.com/in/${nome.toLowerCase().replace(' ', '-')}`
            : null,
          github: temGitHub
            ? `https://github.com/${nome.toLowerCase().replace(' ', '-')}`
            : null,
          portfolio: temPortfolio
            ? `https://${nome.toLowerCase().replace(' ', '-')}.dev`
            : null,
        },
      });

      alunosCriados.push(aluno.id_aluno);
      console.log(
        `✅ Aluno criado: ${nome} (${curso} - ${semestre}º semestre)`,
      );

      // Criar notas variadas (3-8 notas por aluno)
      const numNotas = Math.floor(Math.random() * 6) + 3;
      const disciplinasAluno = selecionarAleatorio(disciplinas, numNotas);

      for (const disciplina of disciplinasAluno) {
        const semestreNota = Math.floor(Math.random() * semestre) + 1;
        const nota = gerarNota();

        await prisma.nota.create({
          data: {
            id_aluno: aluno.id_aluno,
            disciplina,
            nota,
            semestre: semestreNota,
          },
        });
      }

      // Criar aptidões técnicas (4-8 tecnologias por aluno)
      const numAptidoes = Math.floor(Math.random() * 5) + 4;
      const tecnologiasAluno = selecionarAleatorio(tecnologias, numAptidoes);

      for (const tecnologia of tecnologiasAluno) {
        const nivel = gerarNivel();
        await prisma.aptidao.create({
          data: {
            id_aluno: aluno.id_aluno,
            nome: tecnologia.nome,
            nivel,
            descricao: tecnologia.descricao,
          },
        });
      }

      // Criar softskills (5-8 softskills por aluno)
      const numSoftSkills = Math.floor(Math.random() * 4) + 5;
      const softSkillsAluno = selecionarAleatorio(softSkills, numSoftSkills);

      for (const softSkill of softSkillsAluno) {
        const nivel = gerarNivel();
        await prisma.softSkill.create({
          data: {
            id_aluno: aluno.id_aluno,
            nome: softSkill.nome,
            nivel,
            descricao: softSkill.descricao,
          },
        });
      }
    }

    console.log(
      `✅ Seed de alunos concluído! ${alunosCriados.length} alunos criados com notas, aptidões e softskills.`,
    );
    return alunosCriados;
  } catch (error) {
    console.error('❌ Erro ao executar seed de alunos:', error);
    throw error;
  }
}

// Função principal para executar todos os seeds
export async function seed() {
  console.log('🚀 Iniciando seed completo...\n');

  try {
    await seedEmpresas();
    console.log('');
    const alunosIds = await seedAlunos();
    console.log('\n✅ Seed completo finalizado com sucesso!');
    console.log(`📊 Resumo:`);
    console.log(`   - Empresas: ${empresasData.length}`);
    console.log(`   - Alunos: ${alunosIds.length}`);
    console.log(
      `   - Cada aluno possui notas, aptidões técnicas e softskills variadas`,
    );
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    throw error;
  }
}

// Permitir executar o seed diretamente
if (require.main === module) {
  seed()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect().catch(() => {
        // Ignorar erros ao desconectar
      });
    });
}
