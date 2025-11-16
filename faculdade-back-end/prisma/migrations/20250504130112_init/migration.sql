/*
  Warnings:

  - You are about to drop the `perrgunta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "opcaoresposta" DROP CONSTRAINT "opcaoresposta_id_pergunta_fkey";

-- DropForeignKey
ALTER TABLE "perrgunta" DROP CONSTRAINT "perrgunta_id_empresa_fkey";

-- DropForeignKey
ALTER TABLE "usuario_acertos" DROP CONSTRAINT "usuario_acertos_id_pergunta_fkey";

-- DropTable
DROP TABLE "perrgunta";

-- CreateTable
CREATE TABLE "pergunta" (
    "id_pergunta" TEXT NOT NULL,
    "id_faculdade" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "data_criação" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pergunta_pkey" PRIMARY KEY ("id_pergunta")
);

-- AddForeignKey
ALTER TABLE "pergunta" ADD CONSTRAINT "pergunta_id_faculdade_fkey" FOREIGN KEY ("id_faculdade") REFERENCES "faculdade"("id_faculdade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opcaoresposta" ADD CONSTRAINT "opcaoresposta_id_pergunta_fkey" FOREIGN KEY ("id_pergunta") REFERENCES "pergunta"("id_pergunta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_acertos" ADD CONSTRAINT "usuario_acertos_id_pergunta_fkey" FOREIGN KEY ("id_pergunta") REFERENCES "pergunta"("id_pergunta") ON DELETE RESTRICT ON UPDATE CASCADE;
