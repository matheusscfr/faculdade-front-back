import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import getAllQuestionsNotRespond from "@/actions/getAllQuestionsNotRespond";
import { cookies } from "next/headers";

const perguntas = [
  {
    pergunta: "Como funciona o processo seletivo?",
    link: "/perguntas/processo-seletivo"
  },
  {
    pergunta: "Quais cursos estão disponíveis?",
    link: "/perguntas/cursos"
  },
  {
    pergunta: "Como faço minha inscrição?",
    link: "/perguntas/inscricao"
  },
  {
    pergunta: "Quais são as formas de pagamento?",
    link: "/perguntas/pagamento"
  },
  {
    pergunta: "Onde encontro suporte?",
    link: "/perguntas/suporte"
  }
];

export default async function Home() {
  
  const userid: string | undefined = (await cookies()).get("id_usuario")?.value;
  const nome: string | undefined = (await cookies()).get("nome")?.value;
  const { data, ok, error } = await getAllQuestionsNotRespond(userid);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 gap-8">
      <Image
        src="/unidraft.jpg"
        alt="Logo Unidraft"
        width={350}
        height={100}
        className="mb-4 rounded-xl shadow-md"
        priority
      />
      <div>
        <p>Olá {nome}, seja bem-vindo(a) ao Unidraft!</p>
      </div>
      <div className="w-full max-w-xl flex flex-col gap-4">
        {ok && data && data.map((item: any) => (
          <Card key={item.id_pergunta} className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center justify-between py-4 px-6">
              <span className="text-lg font-medium text-primary">{item.enunciado}</span>
              <Button asChild variant="outline">
                <Link href={`/perguntas/${item.id_pergunta}`}>Ver mais</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        {!ok && <p className="text-red-500">Erro ao carregar perguntas: {error}</p>}
        {ok && data && data.length === 0 && <p className="text-gray-600">Nenhuma pergunta pendente.</p>}
      </div>
      <Button
        variant="default"
        className="mt-8 text-lg px-8 py-4 mx-auto"
        asChild
      >
        <Link href="/ranking">Veja o seu ranking</Link>
      </Button>
    </div>
  );
}
