"use client";
import Sidebar from "@/components/Sidebar";
import StudentProfileModal from "@/components/StudentProfileModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  GraduationCap, 
  Bell, 
  Star,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  TrendingUp,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import getStudents, { Student } from "@/actions/get-students";
import { cookies } from "next/headers";

export default function DashboardPage() {
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const result = await getStudents();
        
        if (result.ok && result.data) {
          setStudentsData(result.data);
          setError("");
        } else {
          setError(result.error || "Erro ao carregar dados dos alunos");
        }
      } catch (err) {
        setError("Erro inesperado ao carregar dados");
        console.error("Erro ao buscar alunos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  // Cálculos de estatísticas
  const totalStudents = studentsData.length;
  const totalRequests = studentsData.reduce((sum, student) => sum + student.solicitacoes, 0);
  
  // Estatísticas por semestre
  const semesterStats = studentsData.reduce((acc, student) => {
    acc[student.semestre_atual] = (acc[student.semestre_atual] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Aptidões mais comuns
  const skillsCount = studentsData.reduce((acc, student) => {
    student.aptidoes.forEach(skill => {
      acc[skill.nome] = (acc[skill.nome] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Soft Skills mais comuns
  const softSkillsCount = studentsData.reduce((acc, student) => {
    student.softskills?.forEach(skill => {
      acc[skill.nome] = (acc[skill.nome] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topSkills = Object.entries(skillsCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const topSoftSkills = Object.entries(softSkillsCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Cursos únicos
  const uniqueCourses = [...new Set(studentsData.map(student => student.curso))].length;

  const renderSkillLevel = (level: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= level ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatLinks = (student: Student) => {
    return {
      linkedin: student.linkedin,
      github: student.github,
      portfolio: student.portfolio
    };
  };

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const handleProposalSuccess = async () => {
    // Refetch dos dados dos alunos após proposta enviada
    try {
      const result = await getStudents();
      if (result.ok && result.data) {
        setStudentsData(result.data);
        setError("");
      }
    } catch (err) {
      console.error("Erro ao atualizar dados após proposta:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeItem="dashboard"  />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Carregando dados dos alunos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeItem="dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar dados</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem="dashboard"/>
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Visão geral dos alunos e estatísticas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                    <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Solicitações</p>
                    <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Bell className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cursos</p>
                    <p className="text-2xl font-bold text-gray-900">{uniqueCourses}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aptidões</p>
                    <p className="text-2xl font-bold text-gray-900">{Object.keys(skillsCount).length}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {studentsData.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum aluno cadastrado</h3>
              <p className="text-gray-600">Quando alunos se cadastrarem, eles aparecerão aqui.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista de Alunos */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Alunos Cadastrados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studentsData.slice(0, 10).map((student) => {
                        const links = formatLinks(student);
                        return (
                          <div key={student.id_aluno} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-900">{student.nome}</h3>
                                <p className="text-sm text-gray-600">{student.curso}</p>
                                <p className="text-sm text-blue-600">{student.semestre_atual}º Semestre</p>
                                <p className="text-xs text-gray-500">Matrícula: {student.matricula}</p>
                              </div>
                              <div className="flex space-x-2">
                                {links.linkedin && (
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="w-8 h-8"
                                    onClick={() => window.open(links.linkedin, '_blank')}
                                  >
                                    <Linkedin className="w-4 h-4" />
                                  </Button>
                                )}
                                {links.github && (
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="w-8 h-8"
                                    onClick={() => window.open(links.github, '_blank')}
                                  >
                                    <Github className="w-4 h-4" />
                                  </Button>
                                )}
                                {links.portfolio && (
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="w-8 h-8"
                                    onClick={() => window.open(links.portfolio, '_blank')}
                                  >
                                    <Globe className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">Aptidões:</p>
                              <div className="flex flex-wrap gap-2">
                                {student.aptidoes.map((skill) => (
                                  <div key={skill.id_aptidao} className="bg-blue-50 rounded-full px-3 py-1 border border-blue-200">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-blue-900">{skill.nome}</span>
                                      {renderSkillLevel(skill.nivel)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Soft Skills */}
                            {student.softskills && student.softskills.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-medium text-gray-700 mb-2">Soft Skills:</p>
                                <div className="flex flex-wrap gap-2">
                                  {student.softskills.map((skill) => (
                                    <div key={skill.id_softskill} className="bg-green-50 rounded-full px-3 py-1 border border-green-200">
                                      <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-green-900">{skill.nome}</span>
                                        {renderSkillLevel(skill.nivel)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                {student.solicitacoes} Solicitação de Emprego
                              </span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewProfile(student)}
                              >
                                Ver Perfil
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {studentsData.length > 10 && (
                      <div className="mt-6 text-center">
                        <Button variant="outline" onClick={() => window.location.href = "/alunos"}>
                          Ver todos os {studentsData.length} alunos
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Por Semestre</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(semesterStats)
                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                        .map(([semester, count]) => (
                          <div key={semester} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{semester}º Semestre</span>
                            <span className="font-semibold text-gray-900">{count}</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Aptidões Técnicas Populares</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topSkills.map(([skill, count]) => (
                        <div key={skill} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{skill}</span>
                          <span className="font-semibold text-gray-900">{count}</span>
                        </div>
                      ))}
                      {topSkills.length === 0 && (
                        <p className="text-sm text-gray-500 text-center">
                          Nenhuma aptidão registrada ainda
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Soft Skills Populares</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topSoftSkills.map(([skill, count]) => (
                        <div key={skill} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{skill}</span>
                          <span className="font-semibold text-gray-900">{count}</span>
                        </div>
                      ))}
                      {topSoftSkills.length === 0 && (
                        <p className="text-sm text-gray-500 text-center">
                          Nenhuma soft skill registrada ainda
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <StudentProfileModal
        student={selectedStudent}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onProposalSuccess={handleProposalSuccess}
      />
    </div>
  );
} 