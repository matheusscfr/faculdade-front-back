"use server";
import { NEW_RECRUITER } from "@/functions/api/api-auth";

interface NewRecruterProps {
    nome: string;
    email: string;
    senha: string;
    cargo: string;
    telefone: string;
    id_empresa: string;
}

export default async function newRecruter(props: NewRecruterProps) {
    const {url} = NEW_RECRUITER();

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(props),
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return {data, ok: true, error: ""};
    } catch (error) {
        console.error("Erro ao cadastrar recrutador:", error);
        return {
            data: null, 
            ok: false, 
            error: error instanceof Error ? error.message : "Erro ao cadastrar recrutador"
        };
    }
}
