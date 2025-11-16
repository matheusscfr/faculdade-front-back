"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Mail, Lock, Briefcase, Phone, Building2, ArrowLeft, Loader2 } from "lucide-react";
import getAllEnterprise from "@/actions/getAllEnterprise";
import newRecruter from "@/actions/newRecruter";

interface Enterprise {
  id_empresa: string;
  nome: string;
  cnpj?: string;
  endereco?: string;
}

export default function CadastroRecrutadorPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "",
    telefone: "",
    id_empresa: ""
  });
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loadingEnterprises, setLoadingEnterprises] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Buscar empresas ao carregar a página
  useEffect(() => {
    async function fetchEnterprises() {
      try {
        setLoadingEnterprises(true);
        const result = await getAllEnterprise();
        
        if (result.ok && result.data) {
          setEnterprises(result.data);
        } else {
          setError("Erro ao carregar empresas. Tente novamente.");
        }
      } catch (err) {
        setError("Erro inesperado ao carregar empresas.");
        console.error("Erro ao buscar empresas:", err);
      } finally {
        setLoadingEnterprises(false);
      }
    }

    fetchEnterprises();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validações
    if (!formData.nome || !formData.email || !formData.senha || !formData.cargo || !formData.telefone || !formData.id_empresa) {
      setError("Todos os campos são obrigatórios.");
      setLoading(false);
      return;
    }

    if (formData.senha.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      setLoading(false);
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Digite um email válido.");
      setLoading(false);
      return;
    }

    try {
      const result = await newRecruter(formData);
      
      if (result.ok) {
        setSuccess("Recrutador cadastrado com sucesso! Redirecionando para o login...");
        
        // Limpar formulário
        setFormData({
          nome: "",
          email: "",
          senha: "",
          cargo: "",
          telefone: "",
          id_empresa: ""
        });

        // Redirecionar após 2 segundos
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError(result.error || "Erro ao cadastrar recrutador. Verifique os dados e tente novamente.");
      }
    } catch (err) {
      setError("Erro inesperado ao cadastrar recrutador. Tente novamente.");
      console.error("Erro no cadastro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">UniDraft</h1>
          <p className="text-gray-600">Cadastre-se como recrutador</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Criar Conta de Recrutador
            </CardTitle>
            <CardDescription className="text-gray-600">
              Preencha os dados para se cadastrar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                  Nome Completo *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={handleChange}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="senha" className="text-sm font-medium text-gray-700">
                  Senha *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="senha"
                    name="senha"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={formData.senha}
                    onChange={handleChange}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Cargo */}
              <div className="space-y-2">
                <Label htmlFor="cargo" className="text-sm font-medium text-gray-700">
                  Cargo *
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="cargo"
                    name="cargo"
                    type="text"
                    placeholder="Ex: Recrutador Senior"
                    value={formData.cargo}
                    onChange={handleChange}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                  Telefone *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    placeholder="(xx) xxxxx-xxxx"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Empresa */}
              <div className="space-y-2">
                <Label htmlFor="id_empresa" className="text-sm font-medium text-gray-700">
                  Empresa *
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <select
                    id="id_empresa"
                    name="id_empresa"
                    value={formData.id_empresa}
                    onChange={handleChange}
                    className="w-full h-12 pl-10 pr-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    required
                    disabled={loading || loadingEnterprises}
                  >
                    <option value="">
                      {loadingEnterprises ? "Carregando empresas..." : "Selecione uma empresa"}
                    </option>
                    {enterprises.map((enterprise) => (
                      <option key={enterprise.id_empresa} value={enterprise.id_empresa}>
                        {enterprise.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mensagens de erro/sucesso */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              {/* Botão Cadastrar */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || loadingEnterprises}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar"
                )}
              </Button>
            </form>

            {/* Botão Voltar */}
            <div className="pt-4 border-t border-gray-200">
              <Link href="/login">
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 