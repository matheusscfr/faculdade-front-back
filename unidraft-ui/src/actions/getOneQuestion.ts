"use server";
import { GET_ONE_QUESTIONS } from "@/functions/api/api-auth";
import { cookies } from "next/headers";


export default async function getOneQuestion(idQuestion: string | undefined) {
  const { url } = GET_ONE_QUESTIONS(idQuestion);
  const token = (await cookies()).get("access_token")?.value;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();
    return { data, ok: response.ok, error: "" };
  } catch (error) {
    return { data: null, ok: false, error: "Erro ao fazer login" };
  }
}