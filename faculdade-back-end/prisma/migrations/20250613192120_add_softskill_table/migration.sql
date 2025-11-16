-- CreateTable
CREATE TABLE "softskill" (
    "id_softskill" TEXT NOT NULL,
    "id_aluno" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL,
    "descricao" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "softskill_pkey" PRIMARY KEY ("id_softskill")
);

-- AddForeignKey
ALTER TABLE "softskill" ADD CONSTRAINT "softskill_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "aluno"("id_aluno") ON DELETE RESTRICT ON UPDATE CASCADE;
