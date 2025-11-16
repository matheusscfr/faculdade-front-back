"use client";
import Sidebar from "@/components/Sidebar";
import StudentProfileModal from "@/components/StudentProfileModal";
import ContactModal from "@/components/ContactModal";
import FiltersModal, { FilterOptions } from "@/components/FiltersModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star,
  Github,
  Linkedin,
  Globe,
  Filter,
  Loader2,
  AlertCircle,
  Users
} from "lucide-react";
import { useState, useEffect } from "react";
import getStudents, { Student } from "@/actions/get-students";

export default function AlunosPage() {
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
    semestres: [],
    statusSolicitacoes: 'todos',
    aptidoes: [],
    softskills: [],
    idadeMin: '',
    idadeMax: '',
  });

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

  // Função para calcular idade
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

  // Filtrar alunos com busca básica e filtros avançados
  const filteredStudents = studentsData.filter(student => {
    // Filtro de busca básica
    const matchesSearch = student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.matricula.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de curso
    const matchesCourse = selectedCourse === "" || student.curso === selectedCourse;

    // Filtros avançados
    const matchesSemester = advancedFilters.semestres.length === 0 || 
                           advancedFilters.semestres.includes(student.semestre_atual);

    const matchesStatus = advancedFilters.statusSolicitacoes === 'todos' ||
                         (advancedFilters.statusSolicitacoes === 'com_solicitacoes' && student.solicitacoes > 0) ||
                         (advancedFilters.statusSolicitacoes === 'sem_solicitacoes' && student.solicitacoes === 0);

    const matchesSkills = advancedFilters.aptidoes.length === 0 ||
                         advancedFilters.aptidoes.some(skill =>
                           student.aptidoes.some(studentSkill => studentSkill.nome === skill)
                         );

    const matchesSoftSkills = advancedFilters.softskills.length === 0 ||
                             advancedFilters.softskills.some(skill =>
                               student.softskills?.some(studentSkill => studentSkill.nome === skill)
                             );

    const age = calculateAge(student.data_nascimento);
    const matchesAge = (!advancedFilters.idadeMin || age >= parseInt(advancedFilters.idadeMin)) &&
                      (!advancedFilters.idadeMax || age <= parseInt(advancedFilters.idadeMax));

    return matchesSearch && matchesCourse && matchesSemester && matchesStatus && matchesSkills && matchesSoftSkills && matchesAge;
  });

  // Cursos únicos para o filtro
  const courses = [...new Set(studentsData.map(student => student.curso))];

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

  const handleContactStudent = (student: Student) => {
    setSelectedStudent(student);
    setContactModalOpen(true);
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

  const handleApplyFilters = (filters: FilterOptions) => {
    setAdvancedFilters(filters);
  };

  // Verificar se há filtros avançados ativos
  const hasActiveAdvancedFilters = advancedFilters.semestres.length > 0 || 
    advancedFilters.statusSolicitacoes !== 'todos' ||
    advancedFilters.aptidoes.length > 0 ||
    advancedFilters.softskills.length > 0 ||
    advancedFilters.idadeMin !== '' ||
    advancedFilters.idadeMax !== '';

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeItem="alunos" />
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
        <Sidebar activeItem="alunos" />
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
      <Sidebar activeItem="alunos" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Alunos</h1>
            <p className="text-gray-600">Gerencie e visualize os perfis dos alunos cadastrados</p>
          </div>

          {/* Barra de busca e filtros */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, curso ou matrícula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              
              <div className="lg:w-64">
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Todos os cursos</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <Button 
                variant="outline" 
                className={`h-12 px-6 ${hasActiveAdvancedFilters ? 'border-blue-500 text-blue-600 bg-blue-50' : ''}`}
                onClick={() => setFiltersModalOpen(true)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                {hasActiveAdvancedFilters && (
                  <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {[
                      advancedFilters.semestres.length,
                      advancedFilters.statusSolicitacoes !== 'todos' ? 1 : 0,
                      advancedFilters.aptidoes.length,
                      advancedFilters.softskills.length,
                      (advancedFilters.idadeMin || advancedFilters.idadeMax) ? 1 : 0
                    ].reduce((sum, count) => sum + count, 0)}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-sm text-gray-600">Total de Alunos</p>
              <p className="text-2xl font-bold text-gray-900">{filteredStudents.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-sm text-gray-600">Com Solicitações</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredStudents.filter(s => s.solicitacoes > 0).length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-sm text-gray-600">Sem Solicitações</p>
              <p className="text-2xl font-bold text-orange-600">
                {filteredStudents.filter(s => s.solicitacoes === 0).length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-sm text-gray-600">Semestre Médio</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(filteredStudents.reduce((sum, s) => sum + s.semestre_atual, 0) / filteredStudents.length) || 0}º
              </p>
            </div>
          </div>

          {/* Lista de alunos */}
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                {studentsData.length === 0 ? (
                  <Users className="w-16 h-16 mx-auto" />
                ) : (
                  <Search className="w-16 h-16 mx-auto" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {studentsData.length === 0 ? "Nenhum aluno cadastrado" : "Nenhum aluno encontrado"}
              </h3>
              <p className="text-gray-600">
                {studentsData.length === 0 
                  ? "Quando alunos se cadastrarem, eles aparecerão aqui."
                  : "Tente ajustar os filtros de busca para ver mais resultados."
                }
              </p>
              {hasActiveAdvancedFilters && (
                <Button
                  variant="outline"
                  onClick={() => setAdvancedFilters({
                    semestres: [],
                    statusSolicitacoes: 'todos',
                    aptidoes: [],
                    softskills: [],
                    idadeMin: '',
                    idadeMax: '',
                  })}
                  className="mt-4"
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredStudents.map((student) => {
                const links = formatLinks(student);
                return (
                  <Card key={student.id_aluno} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Informações principais */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">{student.nome}</h3>
                              <p className="text-gray-600">{student.curso}</p>
                              <p className="text-blue-600 font-medium">{student.semestre_atual}º Semestre</p>
                              <p className="text-sm text-gray-500">Matrícula: {student.matricula}</p>
                            </div>
                            
                            <div className="flex space-x-2">
                              {links.linkedin && (
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="w-10 h-10"
                                  onClick={() => window.open(links.linkedin, '_blank')}
                                  title="LinkedIn"
                                >
                                  <Linkedin className="w-4 h-4" />
                                </Button>
                              )}
                              {links.github && (
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="w-10 h-10"
                                  onClick={() => window.open(links.github, '_blank')}
                                  title="GitHub"
                                >
                                  <Github className="w-4 h-4" />
                                </Button>
                              )}
                              {links.portfolio && (
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="w-10 h-10"
                                  onClick={() => window.open(links.portfolio, '_blank')}
                                  title="Portfolio"
                                >
                                  <Globe className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Contato */}
                          <div className="grid md:grid-cols-2 gap-2 mb-4 bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Email:</span> {student.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Telefone:</span> {student.telefone}
                            </p>
                          </div>
                          
                          {/* Aptidões */}
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">Aptidões Técnicas:</p>
                            {student.aptidoes.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {student.aptidoes.map((skill) => (
                                  <div key={skill.id_aptidao} className="bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-blue-900">{skill.nome}</span>
                                      {renderSkillLevel(skill.nivel)}
                                    </div>
                                    {skill.descricao && (
                                      <p className="text-xs text-blue-700 mt-1">{skill.descricao}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">Nenhuma aptidão cadastrada</p>
                            )}
                          </div>

                          {/* Soft Skills */}
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">Soft Skills:</p>
                            {student.softskills && student.softskills.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {student.softskills.map((skill) => (
                                  <div key={skill.id_softskill} className="bg-green-50 border border-green-200 rounded-full px-4 py-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-green-900">{skill.nome}</span>
                                      {renderSkillLevel(skill.nivel)}
                                    </div>
                                    {skill.descricao && (
                                      <p className="text-xs text-green-700 mt-1">{skill.descricao}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">Nenhuma soft skill cadastrada</p>
                            )}
                          </div>

                          {/* Status de solicitações */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                student.solicitacoes > 0 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {student.solicitacoes} solicitação(ões)
                              </span>
                            </div>
                            
                            <div className="flex space-x-3">
                              <Button 
                                variant="outline"
                                onClick={() => handleViewProfile(student)}
                              >
                                Ver Perfil Completo
                              </Button>
                              <Button 
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleContactStudent(student)}
                              >
                                Entrar em Contato
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal do Perfil do Aluno */}
      <StudentProfileModal
        student={selectedStudent}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onProposalSuccess={handleProposalSuccess}
      />

      {/* Modal de Contato */}
      <ContactModal
        student={selectedStudent}
        open={contactModalOpen}
        onOpenChange={setContactModalOpen}
      />

      {/* Modal de Filtros */}
      <FiltersModal
        open={filtersModalOpen}
        onOpenChange={setFiltersModalOpen}
        studentsData={studentsData}
        currentFilters={advancedFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
} 