-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "id_faculdade" TEXT NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "faculdade" (
    "id_faculdade" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,

    CONSTRAINT "faculdade_pkey" PRIMARY KEY ("id_faculdade")
);

-- CreateTable
CREATE TABLE "faculdade_empresa" (
    "id_faculdade_" TEXT NOT NULL,
    "id_faculdade" TEXT NOT NULL,
    "id_empresa" TEXT NOT NULL,

    CONSTRAINT "faculdade_empresa_pkey" PRIMARY KEY ("id_faculdade_")
);

-- CreateTable
CREATE TABLE "opcaoresposta" (
    "id_opcao_resposta" TEXT NOT NULL,
    "id_pergunta" TEXT NOT NULL,
    "texto_resposta" TEXT NOT NULL,
    "correta" BOOLEAN NOT NULL,

    CONSTRAINT "opcaoresposta_pkey" PRIMARY KEY ("id_opcao_resposta")
);

-- CreateTable
CREATE TABLE "usuario_acertos" (
    "id_usuario_acerto" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "id_pergunta" TEXT NOT NULL,

    CONSTRAINT "usuario_acertos_pkey" PRIMARY KEY ("id_usuario_acerto")
);

-- CreateTable
CREATE TABLE "perrgunta" (
    "id_pergunta" TEXT NOT NULL,
    "id_empresa" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "data_criação" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perrgunta_pkey" PRIMARY KEY ("id_pergunta")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_faculdade_fkey" FOREIGN KEY ("id_faculdade") REFERENCES "faculdade"("id_faculdade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculdade_empresa" ADD CONSTRAINT "faculdade_empresa_id_faculdade_fkey" FOREIGN KEY ("id_faculdade") REFERENCES "faculdade"("id_faculdade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opcaoresposta" ADD CONSTRAINT "opcaoresposta_id_pergunta_fkey" FOREIGN KEY ("id_pergunta") REFERENCES "perrgunta"("id_pergunta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_acertos" ADD CONSTRAINT "usuario_acertos_id_pergunta_fkey" FOREIGN KEY ("id_pergunta") REFERENCES "perrgunta"("id_pergunta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_acertos" ADD CONSTRAINT "usuario_acertos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perrgunta" ADD CONSTRAINT "perrgunta_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "faculdade"("id_faculdade") ON DELETE RESTRICT ON UPDATE CASCADE;
