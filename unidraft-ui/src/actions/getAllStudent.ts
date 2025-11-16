import { GET_ALL_STUDENT } from "@/functions/api/api-auth";
import { cookies } from "next/headers";

export default async function getAllStudent() {

    const {url} = GET_ALL_STUDENT();
    const token = (await cookies()).get("access_token")?.value;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}`
            },
        });

        const data = await response.json();

        return {data, ok: response.ok, error: ""};
    } catch (error) {
        return {data: null, ok: false, error: "Erro ao buscar alunos"};
}
}