/*
  Warnings:

  - You are about to drop the `faculdade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faculdade_empresa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `opcaoresposta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pergunta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario_acertos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "faculdade_empresa" DROP CONSTRAINT "faculdade_empresa_id_faculdade_fkey";

-- DropForeignKey
ALTER TABLE "opcaoresposta" DROP CONSTRAINT "opcaoresposta_id_pergunta_fkey";

-- DropForeignKey
ALTER TABLE "pergunta" DROP CONSTRAINT "pergunta_id_faculdade_fkey";

-- DropForeignKey
ALTER TABLE "usuario" DROP CONSTRAINT "usuario_id_faculdade_fkey";

-- DropForeignKey
ALTER TABLE "usuario_acertos" DROP CONSTRAINT "usuario_acertos_id_pergunta_fkey";

-- DropForeignKey
ALTER TABLE "usuario_acertos" DROP CONSTRAINT "usuario_acertos_id_usuario_fkey";

-- DropTable
DROP TABLE "faculdade";

-- DropTable
DROP TABLE "faculdade_empresa";

-- DropTable
DROP TABLE "opcaoresposta";

-- DropTable
DROP TABLE "pergunta";

-- DropTable
DROP TABLE "usuario";

-- DropTable
DROP TABLE "usuario_acertos";

-- CreateTable
CREATE TABLE "recrutador" (
    "id_recrutador" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "id_empresa" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recrutador_pkey" PRIMARY KEY ("id_recrutador")
);

-- CreateTable
CREATE TABLE "empresa" (
    "id_empresa" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "setor" TEXT NOT NULL,
    "descricao" TEXT,
    "website" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateTable
CREATE TABLE "aluno" (
    "id_aluno" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "semestre_atual" INTEGER NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "endereco" TEXT NOT NULL,
    "linkedin" TEXT,
    "github" TEXT,
    "portfolio" TEXT,
    "solicitacoes" INTEGER NOT NULL DEFAULT 0,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aluno_pkey" PRIMARY KEY ("id_aluno")
);

-- CreateTable
CREATE TABLE "contratacao" (
    "id_contratacao" TEXT NOT NULL,
    "id_recrutador" TEXT NOT NULL,
    "id_aluno" TEXT NOT NULL,
    "data_contratacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cargo" TEXT NOT NULL,
    "salario" DOUBLE PRECISION,
    "status" TEXT NOT NULL,

    CONSTRAINT "contratacao_pkey" PRIMARY KEY ("id_contratacao")
);

-- CreateTable
CREATE TABLE "nota" (
    "id_nota" TEXT NOT NULL,
    "id_aluno" TEXT NOT NULL,
    "disciplina" TEXT NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,
    "semestre" INTEGER NOT NULL,

    CONSTRAINT "nota_pkey" PRIMARY KEY ("id_nota")
);

-- CreateTable
CREATE TABLE "aptidao" (
    "id_aptidao" TEXT NOT NULL,
    "id_aluno" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "aptidao_pkey" PRIMARY KEY ("id_aptidao")
);

-- CreateIndex
CREATE UNIQUE INDEX "recrutador_email_key" ON "recrutador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "empresa_cnpj_key" ON "empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_email_key" ON "aluno"("email");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_matricula_key" ON "aluno"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_cpf_key" ON "aluno"("cpf");

-- AddForeignKey
ALTER TABLE "recrutador" ADD CONSTRAINT "recrutador_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratacao" ADD CONSTRAINT "contratacao_id_recrutador_fkey" FOREIGN KEY ("id_recrutador") REFERENCES "recrutador"("id_recrutador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratacao" ADD CONSTRAINT "contratacao_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "aluno"("id_aluno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nota" ADD CONSTRAINT "nota_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "aluno"("id_aluno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aptidao" ADD CONSTRAINT "aptidao_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "aluno"("id_aluno") ON DELETE RESTRICT ON UPDATE CASCADE;
