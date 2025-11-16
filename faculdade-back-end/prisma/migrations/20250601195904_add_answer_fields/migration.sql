/*
  Warnings:

  - Added the required column `acertou` to the `usuario_acertos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_opcao_resposta` to the `usuario_acertos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usuario_acertos" ADD COLUMN     "acertou" BOOLEAN NOT NULL,
ADD COLUMN     "id_opcao_resposta" TEXT NOT NULL;
