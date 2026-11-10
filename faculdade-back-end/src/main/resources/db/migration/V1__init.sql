-- Esquema equivalente ao antigo prisma/schema.prisma (mesmos nomes de tabelas e colunas)

CREATE TABLE "empresa" (
    "id_empresa"       TEXT         NOT NULL,
    "nome"             TEXT         NOT NULL,
    "cnpj"             TEXT         NOT NULL,
    "endereco"         TEXT         NOT NULL,
    "setor"            TEXT         NOT NULL,
    "descricao"        TEXT,
    "website"          TEXT,
    "data_criacao"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "empresa_pkey" PRIMARY KEY ("id_empresa")
);
CREATE UNIQUE INDEX "empresa_cnpj_key" ON "empresa" ("cnpj");

CREATE TABLE "recrutador" (
    "id_recrutador"    TEXT         NOT NULL,
    "nome"             TEXT         NOT NULL,
    "email"            TEXT         NOT NULL,
    "senha"            TEXT         NOT NULL,
    "cargo"            TEXT         NOT NULL,
    "telefone"         TEXT         NOT NULL,
    "id_empresa"       TEXT         NOT NULL,
    "tentativas_login" INTEGER      NOT NULL DEFAULT 0,
    "bloqueado_ate"    TIMESTAMP(3),
    "data_criacao"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "recrutador_pkey" PRIMARY KEY ("id_recrutador")
);
CREATE UNIQUE INDEX "recrutador_email_key" ON "recrutador" ("email");

CREATE TABLE "aluno" (
    "id_aluno"         TEXT         NOT NULL,
    "nome"             TEXT         NOT NULL,
    "email"            TEXT         NOT NULL,
    "senha"            TEXT         NOT NULL,
    "matricula"        TEXT         NOT NULL,
    "curso"            TEXT         NOT NULL,
    "semestre_atual"   INTEGER      NOT NULL,
    "cpf"              TEXT         NOT NULL,
    "telefone"         TEXT         NOT NULL,
    "data_nascimento"  TIMESTAMP(3) NOT NULL,
    "endereco"         TEXT         NOT NULL,
    "linkedin"         TEXT,
    "github"           TEXT,
    "portfolio"        TEXT,
    "solicitacoes"     INTEGER      NOT NULL DEFAULT 0,
    "tentativas_login" INTEGER      NOT NULL DEFAULT 0,
    "bloqueado_ate"    TIMESTAMP(3),
    "data_criacao"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "aluno_pkey" PRIMARY KEY ("id_aluno")
);
CREATE UNIQUE INDEX "aluno_email_key" ON "aluno" ("email");
CREATE UNIQUE INDEX "aluno_matricula_key" ON "aluno" ("matricula");
CREATE UNIQUE INDEX "aluno_cpf_key" ON "aluno" ("cpf");

CREATE TABLE "contratacao" (
    "id_contratacao"   TEXT             NOT NULL,
    "id_recrutador"    TEXT             NOT NULL,
    "id_aluno"         TEXT             NOT NULL,
    "data_contratacao" TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cargo"            TEXT             NOT NULL,
    "salario"          DOUBLE PRECISION,
    "status"           TEXT             NOT NULL,
    CONSTRAINT "contratacao_pkey" PRIMARY KEY ("id_contratacao")
);

CREATE TABLE "nota" (
    "id_nota"    TEXT             NOT NULL,
    "id_aluno"   TEXT             NOT NULL,
    "disciplina" TEXT             NOT NULL,
    "nota"       DOUBLE PRECISION NOT NULL,
    "semestre"   INTEGER          NOT NULL,
    CONSTRAINT "nota_pkey" PRIMARY KEY ("id_nota")
);

CREATE TABLE "aptidao" (
    "id_aptidao" TEXT    NOT NULL,
    "id_aluno"   TEXT    NOT NULL,
    "nome"       TEXT    NOT NULL,
    "nivel"      INTEGER NOT NULL,
    "descricao"  TEXT,
    CONSTRAINT "aptidao_pkey" PRIMARY KEY ("id_aptidao")
);

CREATE TABLE "softskill" (
    "id_softskill"     TEXT         NOT NULL,
    "id_aluno"         TEXT         NOT NULL,
    "nome"             TEXT         NOT NULL,
    "nivel"            INTEGER      NOT NULL,
    "descricao"        TEXT,
    "data_criacao"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "softskill_pkey" PRIMARY KEY ("id_softskill")
);

CREATE TABLE "historico_senha_recrutador" (
    "id_historico"  TEXT         NOT NULL,
    "id_recrutador" TEXT         NOT NULL,
    "senha_hash"    TEXT         NOT NULL,
    "data_criacao"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "historico_senha_recrutador_pkey" PRIMARY KEY ("id_historico")
);

CREATE TABLE "historico_senha_aluno" (
    "id_historico" TEXT         NOT NULL,
    "id_aluno"     TEXT         NOT NULL,
    "senha_hash"   TEXT         NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "historico_senha_aluno_pkey" PRIMARY KEY ("id_historico")
);

ALTER TABLE "recrutador" ADD CONSTRAINT "recrutador_id_empresa_fkey"
    FOREIGN KEY ("id_empresa") REFERENCES "empresa" ("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "contratacao" ADD CONSTRAINT "contratacao_id_recrutador_fkey"
    FOREIGN KEY ("id_recrutador") REFERENCES "recrutador" ("id_recrutador") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "contratacao" ADD CONSTRAINT "contratacao_id_aluno_fkey"
    FOREIGN KEY ("id_aluno") REFERENCES "aluno" ("id_aluno") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "nota" ADD CONSTRAINT "nota_id_aluno_fkey"
    FOREIGN KEY ("id_aluno") REFERENCES "aluno" ("id_aluno") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "aptidao" ADD CONSTRAINT "aptidao_id_aluno_fkey"
    FOREIGN KEY ("id_aluno") REFERENCES "aluno" ("id_aluno") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "softskill" ADD CONSTRAINT "softskill_id_aluno_fkey"
    FOREIGN KEY ("id_aluno") REFERENCES "aluno" ("id_aluno") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "historico_senha_recrutador" ADD CONSTRAINT "historico_senha_recrutador_id_recrutador_fkey"
    FOREIGN KEY ("id_recrutador") REFERENCES "recrutador" ("id_recrutador") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "historico_senha_aluno" ADD CONSTRAINT "historico_senha_aluno_id_aluno_fkey"
    FOREIGN KEY ("id_aluno") REFERENCES "aluno" ("id_aluno") ON DELETE CASCADE ON UPDATE CASCADE;
