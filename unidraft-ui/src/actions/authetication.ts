"use server";
import { AUTH_DASH } from "@/functions/api/api-auth";
import { cookies } from "next/headers";

type Props = {
  email: string;
  senha: string;
};

export default async function authetication_dash(login: Props) {
  const { url } = AUTH_DASH();
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

    const data = await response.json();

    (await cookies()).set("access_token", data.access_token, {
      httpOnly: true,
      secure: true,
    });
    (await cookies()).set("id_recrutador", data.user.id_recrutador, {
      httpOnly: true,
      secure: true,
    });
    (await cookies()).set("nome", data.user.nome, {
      httpOnly: true,
      secure: true,
    });

    return { data, ok: response.ok, error: "" };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro ao fazer login";
    return { data: null, ok: false, error: errorMessage };
  }
}