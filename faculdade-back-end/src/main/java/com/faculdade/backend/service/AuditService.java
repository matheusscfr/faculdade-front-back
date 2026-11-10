package com.faculdade.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Grava eventos de auditoria em logs/audit.log (uma linha JSON por evento),
 * no mesmo formato do AuditService do NestJS.
 */
@Slf4j
@Service
public class AuditService {

    public enum AuditEventType {
        USUARIO_CADASTRADO,
        USUARIO_ATUALIZADO,
        USUARIO_EXCLUIDO,
        SENHA_ALTERADA,
        AUTENTICACAO_SUCESSO,
        AUTENTICACAO_FALHA,
        CONTA_BLOQUEADA,
        MULTIPLAS_FALHAS_AUTENTICACAO,
        OFERTA_CONTRATACAO_CRIADA,
        OFERTA_CONTRATACAO_ACEITA,
        OFERTA_CONTRATACAO_REJEITADA,
        EMPRESA_CRIADA,
        PERFIL_ALUNO_ATUALIZADO
    }

    /** ObjectMapper próprio: as chaves do log ficam em camelCase, como no arquivo original. */
    private final ObjectMapper mapper = new ObjectMapper();
    private final Path auditLogFile;

    public AuditService(@Value("${app.audit.log-dir:logs}") String logDir) throws IOException {
        Path dir = Path.of(logDir);
        Files.createDirectories(dir);
        this.auditLogFile = dir.resolve("audit.log");
    }

    public void logUserCreated(String userName, String userId, String userType) {
        write(AuditEventType.USUARIO_CADASTRADO, userName, userId,
                "Novo " + userType + " cadastrado: " + userName, Map.of("userType", userType));
    }

    public void logUserUpdated(String userName, String userId, Collection<String> fieldsUpdated) {
        write(AuditEventType.USUARIO_ATUALIZADO, userName, userId,
                "Dados atualizados para o usuário: " + userName, Map.of("fieldsUpdated", fieldsUpdated));
    }

    public void logUserDeleted(String userName, String userId, String userType) {
        write(AuditEventType.USUARIO_EXCLUIDO, userName, userId,
                userType + " excluído: " + userName, Map.of("userType", userType));
    }

    public void logPasswordChanged(String userName, String userId) {
        write(AuditEventType.SENHA_ALTERADA, userName, userId,
                "Senha alterada para o usuário: " + userName, null);
    }

    public void logAuthFailure(String userName, String reason) {
        write(AuditEventType.AUTENTICACAO_FALHA, userName, null,
                "Falha de autenticação para o usuário: " + userName + ". Motivo: " + reason,
                Map.of("reason", reason));
    }

    public void logAuthSuccess(String userName, String userId) {
        write(AuditEventType.AUTENTICACAO_SUCESSO, userName, userId,
                "Autenticação bem-sucedida para o usuário: " + userName, null);
    }

    public void logAccountLocked(String userName, String userId, String reason) {
        write(AuditEventType.CONTA_BLOQUEADA, userName, userId,
                "Conta bloqueada para o usuário: " + userName + ". Motivo: " + reason, Map.of("reason", reason));
    }

    public void logMultipleAuthFailures(String userName, int failureCount) {
        write(AuditEventType.MULTIPLAS_FALHAS_AUTENTICACAO, userName, null,
                "Múltiplas falhas de autenticação detectadas para o usuário: " + userName
                        + ". Total de falhas: " + failureCount,
                Map.of("failureCount", failureCount));
    }

    public void logJobOfferCreated(String recruiterName, String recruiterId, String studentName, String position) {
        write(AuditEventType.OFERTA_CONTRATACAO_CRIADA, recruiterName, recruiterId,
                "Oferta de contratação criada por " + recruiterName + " para " + studentName + ". Cargo: " + position,
                Map.of("studentName", studentName, "position", position));
    }

    public void logCompanyCreated(String companyName, String companyId, String createdBy) {
        String autor = createdBy != null ? createdBy : "Sistema";
        write(AuditEventType.EMPRESA_CRIADA, autor, null,
                "Nova empresa cadastrada: " + companyName,
                Map.of("companyId", companyId, "companyName", companyName));
    }

    public void logStudentProfileUpdated(String studentName, String studentId, Collection<String> updatedFields) {
        write(AuditEventType.PERFIL_ALUNO_ATUALIZADO, studentName, studentId,
                "Perfil do aluno " + studentName + " atualizado", Map.of("updatedFields", updatedFields));
    }

    private void write(AuditEventType type, String userName, String userId, String description,
                       Map<String, ?> additionalData) {
        Map<String, Object> linha = new LinkedHashMap<>();
        linha.put("timestamp", Instant.now().toString());
        linha.put("eventType", type.name());
        linha.put("userName", userName != null ? userName : "N/A");
        linha.put("userId", userId != null ? userId : "N/A");
        linha.put("description", description);
        linha.put("additionalData", additionalData != null ? additionalData : Map.of());
        try {
            String json = mapper.writeValueAsString(linha) + System.lineSeparator();
            synchronized (this) {
                Files.writeString(auditLogFile, json, StandardCharsets.UTF_8,
                        StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            }
        } catch (IOException e) {
            log.error("Erro ao gravar log de auditoria", e);
        }
        log.info("[AUDIT] {} - {}", type.name(), description);
    }
}
