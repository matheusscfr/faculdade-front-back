"use client";
import { useState } from "react";
import { Student } from "@/actions/get-students";
import newSolicitation from "@/actions/newSolicitation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Star,
  Linkedin,
  Github,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  User,
  Building,
  DollarSign,
  Send,
  Loader2
} from "lucide-react";
import { cookies } from "next/headers";

interface StudentProfileModalProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProposalSuccess?: () => void;
}

export default function StudentProfileModal({
  student,
  open,
  onOpenChange,
  onProposalSuccess,
}: StudentProfileModalProps) {
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    cargo: "",
    salario: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (!student) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const renderSkillLevel = (level: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= level ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await newSolicitation({
        id_aluno: student.id_aluno,
        cargo: proposalData.cargo,
        salario: parseFloat(proposalData.salario),
      });

      if (result.ok) {
        setSuccess("Proposta enviada com sucesso!");
        setShowProposalForm(false);
        setProposalData({ cargo: "", salario: "" });
        
        // Chamar callback para atualizar dados dos alunos
        if (onProposalSuccess) {
          onProposalSuccess();
        }
        
        setTimeout(() => {
          onOpenChange(false);
          setSuccess("");
        }, 2000);
      } else {
        setError(result.error || "Erro ao enviar proposta");
      }
    } catch (err) {
      setError("Erro inesperado ao enviar proposta");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setShowProposalForm(false);
    setProposalData({ cargo: "", salario: "" });
    setError("");
    setSuccess("");
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) resetModal();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-hidden">
        <div className="overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <DialogClose onClose={() => onOpenChange(false)} />
            <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
              <User className="w-6 h-6 text-blue-600" />
              <span>Perfil do Aluno</span>
            </DialogTitle>
            <DialogDescription>
              Informações completas e opção de enviar proposta
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Informações Básicas */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{student.nome}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <GraduationCap className="w-5 h-5" />
                      <span className="font-medium">{student.curso}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-600">
                      <Calendar className="w-5 h-5" />
                      <span>{student.semestre_atual}º Semestre</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-sm">Matrícula: {student.matricula}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {student.linkedin && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(student.linkedin, '_blank')}
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  )}
                  {student.github && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(student.github, '_blank')}
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </Button>
                  )}
                  {student.portfolio && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(student.portfolio, '_blank')}
                      title="Portfolio"
                    >
                      <Globe className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Grid com informações detalhadas */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Coluna da esquerda - Informações pessoais */}
              <div className="space-y-6">
                {/* Informações de Contato */}
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-blue-600" />
                    Contato
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Email:</span> {student.email}</p>
                    <p><span className="font-medium">Telefone:</span> {student.telefone}</p>
                  </div>
                </div>

                {/* Dados Pessoais */}
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Dados Pessoais
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Idade:</span> {calculateAge(student.data_nascimento)} anos</p>
                    <p><span className="font-medium">CPF:</span> {student.cpf}</p>
                  </div>
                </div>

                {/* Endereço */}
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Endereço
                  </h4>
                  <p className="text-sm text-gray-700">{student.endereco}</p>
                </div>

                {/* Status */}
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Status</h4>
                  <div className="space-y-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      student.solicitacoes > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {student.solicitacoes} solicitação(ões) recebida(s)
                    </span>
                    <p className="text-sm text-gray-500">
                      Cadastrado em {formatDate(student.data_criacao)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Coluna do meio e direita - Aptidões e Soft Skills */}
              <div className="lg:col-span-2 space-y-6">
                {/* Aptidões Técnicas */}
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-6 flex items-center text-lg">
                    <Building className="w-5 h-5 mr-2 text-blue-600" />
                    Aptidões Técnicas
                  </h4>
                  {student.aptidoes.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {student.aptidoes.map((skill) => (
                        <div key={skill.id_aptidao} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="space-y-3">
                            <h5 className="font-semibold text-blue-900 text-center">{skill.nome}</h5>
                            <div className="flex justify-center">
                              {renderSkillLevel(skill.nivel)}
                            </div>
                            {skill.descricao && (
                              <p className="text-sm text-blue-700 text-center leading-relaxed">{skill.descricao}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-500">Nenhuma aptidão cadastrada</p>
                    </div>
                  )}
                </div>

                {/* Soft Skills */}
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-6 flex items-center text-lg">
                    <User className="w-5 h-5 mr-2 text-green-600" />
                    Soft Skills
                  </h4>
                  {student.softskills && student.softskills.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {student.softskills.map((skill) => (
                        <div key={skill.id_softskill} className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="space-y-3">
                            <h5 className="font-semibold text-green-900 text-center">{skill.nome}</h5>
                            <div className="flex justify-center">
                              {renderSkillLevel(skill.nivel)}
                            </div>
                            {skill.descricao && (
                              <p className="text-sm text-green-700 text-center leading-relaxed">{skill.descricao}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-500">Nenhuma soft skill cadastrada</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mensagens de feedback */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Formulário de Proposta */}
            {showProposalForm ? (
              <div className="bg-gray-50 border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Fazer Proposta de Trabalho
                </h4>
                <form onSubmit={handleProposalSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cargo" className="text-sm font-medium text-gray-700">
                        Cargo Oferecido *
                      </Label>
                      <Input
                        id="cargo"
                        type="text"
                        placeholder="Ex: Desenvolvedor Frontend Júnior"
                        value={proposalData.cargo}
                        onChange={(e) => setProposalData(prev => ({ ...prev, cargo: e.target.value }))}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="salario" className="text-sm font-medium text-gray-700">
                        Salário Oferecido (R$) *
                      </Label>
                      <Input
                        id="salario"
                        type="number"
                        placeholder="3000"
                        value={proposalData.salario}
                        onChange={(e) => setProposalData(prev => ({ ...prev, salario: e.target.value }))}
                        className="mt-1"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Proposta
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowProposalForm(false)}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => setShowProposalForm(true)}
                  className="bg-green-600 hover:bg-green-700 px-8"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Fazer Proposta de Trabalho
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 