package com.faculdade.backend.seed;

import com.faculdade.backend.domain.*;
import com.faculdade.backend.repository.AlunoRepository;
import com.faculdade.backend.repository.EmpresaRepository;
import com.faculdade.backend.service.AuditService;
import com.faculdade.backend.service.SenhaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Popula o banco na inicialização (substitui o antigo src/prisma/seed.ts).
 * É idempotente: empresas são identificadas pelo CNPJ e alunos pelo e-mail.
 * Controlado por app.seed.empresas / app.seed.alunos (env SEED_EMPRESAS / SEED_ALUNOS).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final EmpresaRepository empresaRepository;
    private final AlunoRepository alunoRepository;
    private final SenhaService senhaService;
    private final AuditService auditService;

    @Value("${app.seed.empresas:true}")
    private boolean seedEmpresas;

    @Value("${app.seed.alunos:true}")
    private boolean seedAlunos;

    private record Item(String nome, String descricao) {
    }

    private static final List<String[]> EMPRESAS = List.of(
            new String[]{"Tech Solutions Brasil", "12345678000190", "Av. Paulista, 1000 - São Paulo/SP", "Tecnologia",
                    "Empresa de desenvolvimento de software e consultoria em TI", "https://techsolutions.com.br"},
            new String[]{"Inovação Digital Ltda", "98765432000185", "Rua do Comércio, 500 - Recife/PE", "Tecnologia",
                    "Startup focada em soluções digitais e transformação digital", "https://inovacaodigital.com.br"},
            new String[]{"CodeMasters Academy", "11223344000155", "Av. Boa Viagem, 2500 - Recife/PE", "Educação",
                    "Plataforma de ensino de programação e desenvolvimento de software", "https://codemasters.edu.br"});

    private static final List<String> CURSOS = List.of(
            "Ciência da Computação", "Engenharia de Software", "Sistemas de Informação",
            "Análise e Desenvolvimento de Sistemas", "Engenharia da Computação", "Tecnologia da Informação");

    private static final List<String> DISCIPLINAS = List.of(
            "Algoritmos e Estruturas de Dados", "Programação Orientada a Objetos", "Banco de Dados",
            "Desenvolvimento Web", "Engenharia de Software", "Redes de Computadores", "Inteligência Artificial",
            "Segurança da Informação", "Sistemas Operacionais", "Compiladores", "Arquitetura de Computadores",
            "Interface Humano-Computador", "Testes de Software", "DevOps", "Cloud Computing",
            "Mobile Development", "Machine Learning", "Big Data");

    private static final List<Item> TECNOLOGIAS = List.of(
            new Item("JavaScript", "Linguagem de programação para desenvolvimento web"),
            new Item("TypeScript", "Superset do JavaScript com tipagem estática"),
            new Item("Python", "Linguagem versátil para desenvolvimento e ciência de dados"),
            new Item("Java", "Linguagem orientada a objetos para aplicações enterprise"),
            new Item("React", "Biblioteca JavaScript para construção de interfaces"),
            new Item("Node.js", "Runtime JavaScript para backend"),
            new Item("Vue.js", "Framework JavaScript progressivo"),
            new Item("Angular", "Framework TypeScript para aplicações web"),
            new Item("PostgreSQL", "Sistema de gerenciamento de banco de dados relacional"),
            new Item("MongoDB", "Banco de dados NoSQL orientado a documentos"),
            new Item("Docker", "Plataforma de containerização"),
            new Item("Kubernetes", "Orquestração de containers"),
            new Item("AWS", "Serviços de cloud computing da Amazon"),
            new Item("Git", "Sistema de controle de versão"),
            new Item("Linux", "Sistema operacional open source"),
            new Item("REST API", "Arquitetura para desenvolvimento de APIs"),
            new Item("GraphQL", "Linguagem de consulta para APIs"),
            new Item("Microservices", "Arquitetura de software distribuída"));

    private static final List<Item> SOFT_SKILLS = List.of(
            new Item("Comunicação", "Habilidade de transmitir ideias de forma clara e eficaz"),
            new Item("Trabalho em Equipe", "Capacidade de colaborar efetivamente em grupos"),
            new Item("Liderança", "Habilidade de guiar e motivar equipes"),
            new Item("Resolução de Problemas", "Capacidade de analisar e resolver desafios complexos"),
            new Item("Pensamento Crítico", "Análise objetiva e avaliação de situações"),
            new Item("Adaptabilidade", "Flexibilidade para lidar com mudanças"),
            new Item("Gestão de Tempo", "Organização eficiente de tarefas e prazos"),
            new Item("Criatividade", "Capacidade de gerar ideias inovadoras"),
            new Item("Proatividade", "Iniciativa para antecipar necessidades"),
            new Item("Empatia", "Compreensão das perspectivas dos outros"));

    private static final List<String> NOMES = List.of(
            "Ana Silva", "Bruno Santos", "Carlos Oliveira", "Diana Costa", "Eduardo Lima", "Fernanda Souza",
            "Gabriel Alves", "Helena Martins", "Igor Pereira", "Julia Ferreira", "Lucas Rodrigues", "Mariana Gomes",
            "Nicolas Ribeiro", "Olivia Carvalho", "Pedro Araújo", "Quésia Barbosa", "Rafael Cunha", "Sofia Dias",
            "Thiago Freitas", "Valentina Nunes", "Wagner Monteiro", "Ximena Cardoso", "Yuri Moura", "Zara Teixeira",
            "André Rocha", "Beatriz Moreira", "Caio Melo", "Daniela Castro", "Erick Ramos", "Flávia Rezende",
            "Gustavo Farias", "Hannah Mendes", "Ivan Pires", "Jéssica Machado", "Kauã Lopes", "Larissa Azevedo",
            "Marcos Correia", "Natália Barros", "Otávio Campos", "Paula Duarte", "Rafaela Vieira",
            "Samuel Nascimento", "Tatiana Guimarães", "Ulisses Dantas", "Vanessa Coelho", "William Pinheiro",
            "Yasmin Siqueira", "Zé Ricardo", "Amanda Torres", "Breno Leal");

    @Override
    public void run(ApplicationArguments args) {
        try {
            if (seedEmpresas) {
                seedEmpresas();
            }
            if (seedAlunos) {
                seedAlunos();
            }
        } catch (Exception e) {
            log.error("Erro ao executar seed", e);
        }
    }

    void seedEmpresas() {
        log.info("Iniciando seed de empresas...");
        for (String[] d : EMPRESAS) {
            if (empresaRepository.existsByCnpj(d[1])) {
                continue;
            }
            Empresa e = new Empresa();
            e.setNome(d[0]);
            e.setCnpj(d[1]);
            e.setEndereco(d[2]);
            e.setSetor(d[3]);
            e.setDescricao(d[4]);
            e.setWebsite(d[5]);
            e = empresaRepository.save(e);
            auditService.logCompanyCreated(e.getNome(), e.getIdEmpresa(), "Sistema de Seed");
            log.info("Empresa criada: {} (CNPJ: {})", e.getNome(), e.getCnpj());
        }
    }

    void seedAlunos() {
        log.info("Iniciando seed de alunos...");
        ThreadLocalRandom rnd = ThreadLocalRandom.current();
        String senhaHash = senhaService.hash("123456"); // senha padrão dos alunos de seed
        int criados = 0;

        for (int i = 1; i <= NOMES.size(); i++) {
            String email = "aluno" + i + "@faculdade.edu.br";
            if (alunoRepository.existsByEmail(email)) {
                continue;
            }
            String nome = NOMES.get(i - 1);
            String slug = nome.toLowerCase().replaceFirst(" ", "-");
            int semestre = rnd.nextInt(1, 9);

            Aluno aluno = new Aluno();
            aluno.setNome(nome);
            aluno.setEmail(email);
            aluno.setSenha(senhaHash);
            aluno.setMatricula("202" + rnd.nextInt(4) + String.format("%04d", i));
            aluno.setCurso(sortear(CURSOS));
            aluno.setSemestreAtual(semestre);
            aluno.setCpf(gerarCpf(i));
            aluno.setTelefone(String.format("(81) 9%d-%d", rnd.nextInt(1000, 10000), rnd.nextInt(1000, 10000)));
            aluno.setDataNascimento(LocalDate.now().minusYears(rnd.nextInt(18, 31))
                    .withMonth(rnd.nextInt(1, 13)).withDayOfMonth(rnd.nextInt(1, 29))
                    .atStartOfDay(ZoneOffset.UTC).toInstant());
            aluno.setEndereco("Rua " + sortear(List.of("A", "B", "C", "D")) + ", " + rnd.nextInt(1, 1000)
                    + " - Recife/PE");
            aluno.setLinkedin(rnd.nextDouble() > 0.2 ? "https://linkedin.com/in/" + slug : null);
            aluno.setGithub(rnd.nextDouble() > 0.3 ? "https://github.com/" + slug : null);
            aluno.setPortfolio(rnd.nextDouble() > 0.5 ? "https://" + slug + ".dev" : null);

            for (String disciplina : sortearVarios(DISCIPLINAS, rnd.nextInt(3, 9))) {
                Nota nota = new Nota();
                nota.setDisciplina(disciplina);
                nota.setNota(Math.round((rnd.nextDouble() * 5 + 5) * 10) / 10.0);
                nota.setSemestre(rnd.nextInt(1, semestre + 1));
                aluno.adicionarNota(nota);
            }
            for (Item t : sortearVarios(TECNOLOGIAS, rnd.nextInt(4, 9))) {
                Aptidao a = new Aptidao();
                a.setNome(t.nome());
                a.setDescricao(t.descricao());
                a.setNivel(rnd.nextInt(1, 6));
                aluno.adicionarAptidao(a);
            }
            for (Item s : sortearVarios(SOFT_SKILLS, rnd.nextInt(5, 9))) {
                SoftSkill sk = new SoftSkill();
                sk.setNome(s.nome());
                sk.setDescricao(s.descricao());
                sk.setNivel(rnd.nextInt(1, 6));
                aluno.adicionarSoftSkill(sk);
            }

            alunoRepository.save(aluno);
            criados++;
        }
        log.info("Seed de alunos concluído! {} novo(s) aluno(s) criado(s).", criados);
    }

    /** CPF fictício único por índice (o seed antigo sorteava e podia colidir). */
    private static String gerarCpf(int i) {
        String base = String.format("%09d", 900_000_000 + i);
        return base.substring(0, 3) + "." + base.substring(3, 6) + "." + base.substring(6, 9) + "-00";
    }

    private static <T> T sortear(List<T> lista) {
        return lista.get(ThreadLocalRandom.current().nextInt(lista.size()));
    }

    private static <T> List<T> sortearVarios(List<T> lista, int quantidade) {
        List<T> copia = new ArrayList<>(lista);
        Collections.shuffle(copia);
        return copia.subList(0, Math.min(quantidade, copia.size()));
    }
}
