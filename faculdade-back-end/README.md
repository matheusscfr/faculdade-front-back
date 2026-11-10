# faculdade-back-end (Java / Spring Boot)

API de recrutamento de alunos (UniDraft). Reescrita do antigo back-end NestJS + Prisma em
**Java 17+ / Spring Boot 3.5**, mantendo as **mesmas rotas, o mesmo formato JSON (snake_case)
e o mesmo banco PostgreSQL** — o front-end (`unidraft-ui`) funciona sem alterações.

## Stack

| Antes (NestJS)                 | Agora (Spring Boot)                                  |
|--------------------------------|------------------------------------------------------|
| Prisma + `prisma db push`      | Spring Data JPA (Hibernate) + Flyway (`db/migration`) |
| class-validator                | Bean Validation (`jakarta.validation`) + `@StrongPassword` |
| passport-jwt / @nestjs/jwt     | Spring Security + filtro JWT (`com.auth0:java-jwt`, HS256) |
| bcryptjs                       | `BCryptPasswordEncoder` (lê os hashes antigos do bcryptjs) |
| AuditService (fs)              | `AuditService` → `logs/audit.log` (mesmo formato JSON por linha) |
| `src/prisma/seed.ts`           | `DataSeeder` (roda na inicialização, idempotente)     |

## Estrutura

```
src/main/java/com/faculdade/backend
├── config/        SecurityConfig, desserializador de datas
├── controller/    AlunoController, EmpresaController, RecrutadorController
├── domain/        entidades JPA (Aluno, Recrutador, Empresa, Contratacao, ...)
├── dto/           requests/responses (records)
├── exception/     ApiException + handler global (formato de erro igual ao NestJS)
├── repository/    Spring Data JPA
├── security/      JwtService, JwtAuthenticationFilter
├── seed/          DataSeeder
├── service/       regras de negócio (bloqueio de login, histórico de senhas, auditoria)
└── validation/    @StrongPassword
src/main/resources
├── application.yml
└── db/migration/V1__init.sql
```

## Rotas

| Método | Rota                                         | Auth |
|--------|----------------------------------------------|------|
| POST   | `/recrutadores`                              | –    |
| POST   | `/recrutadores/login`                        | –    |
| GET    | `/recrutadores` / `/recrutadores/{id}`       | JWT  |
| PATCH  | `/recrutadores/{id}` / `/recrutadores/{id}/senha` | JWT |
| DELETE | `/recrutadores/{id}`                         | JWT  |
| POST   | `/recrutadores/oferta-contratacao/{id_recrutador}` | JWT |
| POST   | `/aluno` (body `{ "alunos": [...] }`)        | –    |
| GET    | `/aluno` / `/aluno/{id}`                     | JWT  |
| PATCH  | `/aluno/{id}` / `/aluno/{id}/senha`          | JWT  |
| DELETE | `/aluno/{id}`                                | JWT  |
| GET    | `/empresa` / `/empresa/{id}`                 | –    |
| POST   | `/empresa`                                   | –    |

Regras de segurança mantidas: senha forte (10+ caracteres, maiúscula, minúscula, número e especial),
bloqueio de 10 min após 5 logins errados, proibição de reutilizar as 3 últimas senhas e log de auditoria.

## Executando

Pré-requisitos: JDK 17+ e PostgreSQL (ou Docker).

```bash
# a partir da raiz do repositório: sobe postgres + back-end + front-end + nginx
docker compose up --build

# ou só o back-end, localmente
cd faculdade-back-end
./mvnw spring-boot:run          # usa jdbc:postgresql://localhost:5432/faculdade (postgres/docker)
./mvnw test                     # testes unitários
```

### Variáveis de ambiente

| Variável        | Padrão                                       |
|-----------------|----------------------------------------------|
| `PORT`          | `3000`                                       |
| `DB_URL`        | `jdbc:postgresql://localhost:5432/faculdade` |
| `DB_USERNAME`   | `postgres`                                   |
| `DB_PASSWORD`   | `docker`                                     |
| `JWT_SECRET`    | `seuSegredoSuperSecreto` (troque em produção) |
| `AUDIT_LOG_DIR` | `logs`                                       |
| `SEED_EMPRESAS` | `true`                                       |
| `SEED_ALUNOS`   | `true` (50 alunos de exemplo, senha `123456`) |

### Banco de dados existente

O esquema é o mesmo do antigo `schema.prisma`. Se o banco já tiver sido criado pelo Prisma, o Flyway
faz *baseline* na versão 1 e **não** recria as tabelas; os dados e as senhas continuam válidos.
