import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { USER_ID } from "./functions/api/api-auth";


export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;
    const userid: string | undefined = request.cookies.get("id_usuario")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const {url} = USER_ID(userid);
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const tokenValidation = await fetch( url , {
      cache: "no-store",
      method: "GET",
      headers,
    });

    if (!tokenValidation.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/perguntas/:path*", "/ranking", "/"],
};