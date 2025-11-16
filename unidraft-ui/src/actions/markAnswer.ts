"use server";
import { MARK_ANSWER } from "@/functions/api/api-auth";
import { cookies } from "next/headers";

type Props = {
  id_pergunta: string;
  id_opcao_resposta: string;
};

export default async function markAnswer(answer: Props) {
  const userid: string | undefined = (await cookies()).get("id_usuario")?.value;
  const { url } = MARK_ANSWER(userid);
  const token = (await cookies()).get("access_token")?.value;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(answer),
      cache: "no-store",
    });

    const data = await response.json();
    console.log(data);
    return { data, ok: response.ok, error: "" };
  } catch (error) {
    return { data: null, ok: false, error: "Erro ao enviar resposta" };
  }
}