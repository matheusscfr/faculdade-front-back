"use server";
import { cookies } from "next/headers";
import { NEW_SOLICITATION } from "@/functions/api/api-auth";

interface NewSolicitationProps {
    id_aluno: string;
    cargo: string;
    salario: number;
}

export default async function newSolicitation(data: NewSolicitationProps) {
    try {

        const recrutador_id = (await cookies()).get("id_recrutador")?.value;
        const token = (await cookies()).get("access_token")?.value;

        const { url } = NEW_SOLICITATION(recrutador_id);

        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);

        return { 
            ok: true, 
            data: result, 
            error: "" 
        };
    } catch (error) {
        console.error("Erro ao criar solicitação:", error);
        return { 
            ok: false, 
            data: null, 
            error: error instanceof Error ? error.message : "Erro ao enviar proposta" 
        };
    }
}
