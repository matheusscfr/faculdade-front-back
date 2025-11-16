"use server";
import { GET_ALL_STUDENT } from "@/functions/api/api-auth";
import { cookies } from "next/headers";

export type Aptidao = {
  id_aptidao: string;
  id_aluno: string;
  nome: string;
  nivel: number;
  descricao: string;
};

export type SoftSkill = {
  id_softskill: string;
  id_aluno: string;
  nome: string;
  nivel: number;
  descricao: string;
  data_criacao: string;
  data_atualizacao: string;
};

export type Student = {
  id_aluno: string;
  nome: string;
  email: string;
  senha: string;
  matricula: string;
  curso: string;
  semestre_atual: number;
  cpf: string;
  telefone: string;
  data_nascimento: string;
  endereco: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  solicitacoes: number;
  data_criacao: string;
  data_atualizacao: string;
  aptidoes: Aptidao[];
  softskills: SoftSkill[];
};

export default async function getStudents() {
  const { url } = GET_ALL_STUDENT();
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token.value}` : "",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Student[] = await response.json();

    return { data, ok: true, error: "" };
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    return { 
      data: null, 
      ok: false, 
      error: error instanceof Error ? error.message : "Erro ao buscar alunos" 
    };
  }
} 