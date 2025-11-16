import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export enum AuditEventType {
  // Eventos de usuário
  USER_CREATED = 'USUARIO_CADASTRADO',
  USER_UPDATED = 'USUARIO_ATUALIZADO',
  USER_DELETED = 'USUARIO_EXCLUIDO',
  PASSWORD_CHANGED = 'SENHA_ALTERADA',

  // Eventos de autenticação
  AUTH_SUCCESS = 'AUTENTICACAO_SUCESSO',
  AUTH_FAILURE = 'AUTENTICACAO_FALHA',
  ACCOUNT_LOCKED = 'CONTA_BLOQUEADA',
  MULTIPLE_AUTH_FAILURES = 'MULTIPLAS_FALHAS_AUTENTICACAO',

  // Eventos de negócio
  JOB_OFFER_CREATED = 'OFERTA_CONTRATACAO_CRIADA',
  JOB_OFFER_ACCEPTED = 'OFERTA_CONTRATACAO_ACEITA',
  JOB_OFFER_REJECTED = 'OFERTA_CONTRATACAO_REJEITADA',
  COMPANY_CREATED = 'EMPRESA_CRIADA',
  STUDENT_PROFILE_UPDATED = 'PERFIL_ALUNO_ATUALIZADO',
}

interface AuditLog {
  timestamp: string;
  eventType: AuditEventType;
  userName?: string;
  userId?: string;
  description: string;
  additionalData?: any;
}

@Injectable()
export class AuditService {
  private readonly logDir = path.join(process.cwd(), 'logs');
  private readonly auditLogFile = path.join(this.logDir, 'audit.log');

  constructor() {
    this.ensureLogDirectoryExists();
  }

  private ensureLogDirectoryExists(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatLogEntry(log: AuditLog): string {
    const logLine = {
      timestamp: log.timestamp,
      eventType: log.eventType,
      userName: log.userName || 'N/A',
      userId: log.userId || 'N/A',
      description: log.description,
      additionalData: log.additionalData || {},
    };

    return JSON.stringify(logLine) + '\n';
  }

  private writeLog(log: AuditLog): void {
    const logEntry = this.formatLogEntry(log);

    fs.appendFile(this.auditLogFile, logEntry, (err) => {
      if (err) {
        console.error('Erro ao gravar log de auditoria:', err);
      }
    });

    // Também loga no console para debug
    console.log(`[AUDIT] ${log.eventType} - ${log.description}`);
  }

  /**
   * Registra cadastro de novo usuário
   */
  logUserCreated(userName: string, userId: string, userType: 'recrutador' | 'aluno'): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.USER_CREATED,
      userName,
      userId,
      description: `Novo ${userType} cadastrado: ${userName}`,
      additionalData: { userType },
    });
  }

  /**
   * Registra atualização de dados do usuário
   */
  logUserUpdated(userName: string, userId: string, fieldsUpdated: string[]): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.USER_UPDATED,
      userName,
      userId,
      description: `Dados atualizados para o usuário: ${userName}`,
      additionalData: { fieldsUpdated },
    });
  }

  /**
   * Registra exclusão de usuário
   */
  logUserDeleted(userName: string, userId: string, userType: 'recrutador' | 'aluno'): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.USER_DELETED,
      userName,
      userId,
      description: `${userType} excluído: ${userName}`,
      additionalData: { userType },
    });
  }

  /**
   * Registra alteração de senha
   */
  logPasswordChanged(userName: string, userId: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.PASSWORD_CHANGED,
      userName,
      userId,
      description: `Senha alterada para o usuário: ${userName}`,
    });
  }

  /**
   * Registra falha de autenticação
   */
  logAuthFailure(userName: string, reason: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.AUTH_FAILURE,
      userName,
      description: `Falha de autenticação para o usuário: ${userName}. Motivo: ${reason}`,
      additionalData: { reason },
    });
  }

  /**
   * Registra sucesso de autenticação
   */
  logAuthSuccess(userName: string, userId: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.AUTH_SUCCESS,
      userName,
      userId,
      description: `Autenticação bem-sucedida para o usuário: ${userName}`,
    });
  }

  /**
   * Registra bloqueio de conta
   */
  logAccountLocked(userName: string, userId: string, reason: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.ACCOUNT_LOCKED,
      userName,
      userId,
      description: `Conta bloqueada para o usuário: ${userName}. Motivo: ${reason}`,
      additionalData: { reason },
    });
  }

  /**
   * Registra múltiplas falhas de autenticação (5 ou mais)
   */
  logMultipleAuthFailures(userName: string, failureCount: number): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.MULTIPLE_AUTH_FAILURES,
      userName,
      description: `Múltiplas falhas de autenticação detectadas para o usuário: ${userName}. Total de falhas: ${failureCount}`,
      additionalData: { failureCount },
    });
  }

  /**
   * Registra criação de oferta de contratação
   */
  logJobOfferCreated(recruiterName: string, recruiterId: string, studentName: string, position: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.JOB_OFFER_CREATED,
      userName: recruiterName,
      userId: recruiterId,
      description: `Oferta de contratação criada por ${recruiterName} para ${studentName}. Cargo: ${position}`,
      additionalData: { studentName, position },
    });
  }

  /**
   * Registra aceitação de oferta de contratação
   */
  logJobOfferAccepted(studentName: string, studentId: string, position: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.JOB_OFFER_ACCEPTED,
      userName: studentName,
      userId: studentId,
      description: `Oferta de contratação aceita por ${studentName}. Cargo: ${position}`,
      additionalData: { position },
    });
  }

  /**
   * Registra rejeição de oferta de contratação
   */
  logJobOfferRejected(studentName: string, studentId: string, position: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.JOB_OFFER_REJECTED,
      userName: studentName,
      userId: studentId,
      description: `Oferta de contratação rejeitada por ${studentName}. Cargo: ${position}`,
      additionalData: { position },
    });
  }

  /**
   * Registra criação de empresa
   */
  logCompanyCreated(companyName: string, companyId: string, createdBy?: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.COMPANY_CREATED,
      userName: createdBy || 'Sistema',
      description: `Nova empresa cadastrada: ${companyName}`,
      additionalData: { companyId, companyName },
    });
  }

  /**
   * Registra atualização de perfil de aluno
   */
  logStudentProfileUpdated(studentName: string, studentId: string, updatedFields: string[]): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.STUDENT_PROFILE_UPDATED,
      userName: studentName,
      userId: studentId,
      description: `Perfil do aluno ${studentName} atualizado`,
      additionalData: { updatedFields },
    });
  }

  /**
   * Método genérico para registrar eventos customizados
   */
  logCustomEvent(eventType: string, description: string, userName?: string, additionalData?: any): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      eventType: eventType as AuditEventType,
      userName,
      description,
      additionalData,
    });
  }
}
