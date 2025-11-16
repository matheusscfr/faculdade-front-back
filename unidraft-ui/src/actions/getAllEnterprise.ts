"use server";
import { GET_ALL_ENTERPRISE } from "@/functions/api/api-auth";

export default async function getAllEnterprise() {
    const {url} = GET_ALL_ENTERPRISE();
    
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return {data, ok: true, error: ""};
    } catch (error) {
        console.error("Erro ao buscar empresas:", error);
        return {
            data: null, 
            ok: false, 
            error: error instanceof Error ? error.message : "Erro ao buscar empresas"
        };
    }
}