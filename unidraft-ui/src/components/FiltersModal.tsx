"use client";
import { useState, useEffect } from "react";
import { Student } from "@/actions/get-students";
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
import { Filter, RotateCcw, Check } from "lucide-react";

export interface FilterOptions {
  semestres: number[];
  statusSolicitacoes: 'todos' | 'com_solicitacoes' | 'sem_solicitacoes';
  aptidoes: string[];
  softskills: string[];
  idadeMin: string;
  idadeMax: string;
}

interface FiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentsData: Student[];
  currentFilters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
}

export default function FiltersModal({
  open,
  onOpenChange,
  studentsData,
  currentFilters,
  onApplyFilters,
}: FiltersModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  // Atualizar filtros quando o modal abrir
  useEffect(() => {
    if (open) {
      setFilters(currentFilters);
    }
  }, [open, currentFilters]);

  // Extrair dados únicos para os filtros
  const availableSemesters = [...new Set(studentsData.map(student => student.semestre_atual))]
    .sort((a, b) => a - b);
  
  const availableSkills = [...new Set(
    studentsData.flatMap(student => student.aptidoes.map(skill => skill.nome))
  )].sort();

  const availableSoftSkills = [...new Set(
    studentsData.flatMap(student => student.softskills?.map(skill => skill.nome) || [])
  )].sort();

  const handleSemesterToggle = (semester: number) => {
    setFilters(prev => ({
      ...prev,
      semestres: prev.semestres.includes(semester)
        ? prev.semestres.filter(s => s !== semester)
        : [...prev.semestres, semester]
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      aptidoes: prev.aptidoes.includes(skill)
        ? prev.aptidoes.filter(s => s !== skill)
        : [...prev.aptidoes, skill]
    }));
  };

  const handleSoftSkillToggle = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      softskills: prev.softskills.includes(skill)
        ? prev.softskills.filter(s => s !== skill)
        : [...prev.softskills, skill]
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      semestres: [],
      statusSolicitacoes: 'todos',
      aptidoes: [],
      softskills: [],
      idadeMin: '',
      idadeMax: '',
    };
    setFilters(clearedFilters);
  };

  const hasActiveFilters = filters.semestres.length > 0 || 
    filters.statusSolicitacoes !== 'todos' ||
    filters.aptidoes.length > 0 ||
    filters.softskills.length > 0 ||
    filters.idadeMin !== '' ||
    filters.idadeMax !== '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" max-w-xl max-h-[90vh] overflow-hidden fixed top-[50%] left-[50%] translate-x-[-50%]">
        <div className="overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <DialogClose onClose={() => onOpenChange(false)} />
            <DialogTitle className="text-xl font-bold flex items-center space-x-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <span>Filtros Avançados</span>
            </DialogTitle>
            <DialogDescription>
              Refine sua busca com filtros personalizados
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Filtro por Semestre */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Semestre Atual
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableSemesters.map(semester => (
                  <Button
                    key={semester}
                    variant={filters.semestres.includes(semester) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSemesterToggle(semester)}
                    className={filters.semestres.includes(semester) ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    {filters.semestres.includes(semester) && (
                      <Check className="w-3 h-3 mr-1" />
                    )}
                    {semester}º Semestre
                  </Button>
                ))}
              </div>
            </div>

            {/* Filtro por Status de Solicitações */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Status de Solicitações
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={filters.statusSolicitacoes === 'todos' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, statusSolicitacoes: 'todos' }))}
                  className={filters.statusSolicitacoes === 'todos' ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {filters.statusSolicitacoes === 'todos' && <Check className="w-3 h-3 mr-1" />}
                  Todos
                </Button>
                <Button
                  variant={filters.statusSolicitacoes === 'com_solicitacoes' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, statusSolicitacoes: 'com_solicitacoes' }))}
                  className={filters.statusSolicitacoes === 'com_solicitacoes' ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {filters.statusSolicitacoes === 'com_solicitacoes' && <Check className="w-3 h-3 mr-1" />}
                  Com Solicitações
                </Button>
                <Button
                  variant={filters.statusSolicitacoes === 'sem_solicitacoes' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, statusSolicitacoes: 'sem_solicitacoes' }))}
                  className={filters.statusSolicitacoes === 'sem_solicitacoes' ? "bg-orange-600 hover:bg-orange-700" : ""}
                >
                  {filters.statusSolicitacoes === 'sem_solicitacoes' && <Check className="w-3 h-3 mr-1" />}
                  Sem Solicitações
                </Button>
              </div>
            </div>

            {/* Filtro por Faixa de Idade */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Faixa de Idade
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="idadeMin" className="text-xs text-gray-500">
                    Idade Mínima
                  </Label>
                  <Input
                    id="idadeMin"
                    type="number"
                    placeholder="18"
                    value={filters.idadeMin}
                    onChange={(e) => setFilters(prev => ({ ...prev, idadeMin: e.target.value }))}
                    className="mt-1"
                    min="16"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="idadeMax" className="text-xs text-gray-500">
                    Idade Máxima
                  </Label>
                  <Input
                    id="idadeMax"
                    type="number"
                    placeholder="30"
                    value={filters.idadeMax}
                    onChange={(e) => setFilters(prev => ({ ...prev, idadeMax: e.target.value }))}
                    className="mt-1"
                    min="16"
                    max="100"
                  />
                </div>
              </div>
            </div>

            {/* Filtro por Aptidões */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Aptidões Técnicas
              </Label>
              {availableSkills.length > 0 ? (
                <div className="max-h-48 overflow-y-auto border rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {availableSkills.map(skill => (
                      <Button
                        key={skill}
                        variant={filters.aptidoes.includes(skill) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSkillToggle(skill)}
                        className={`justify-start text-left ${
                          filters.aptidoes.includes(skill) ? "bg-blue-600 hover:bg-blue-700" : ""
                        }`}
                      >
                        {filters.aptidoes.includes(skill) && (
                          <Check className="w-3 h-3 mr-1 flex-shrink-0" />
                        )}
                        <span className="truncate">{skill}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Nenhuma aptidão disponível</p>
              )}
            </div>

            {/* Filtro por Soft Skills */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Soft Skills
              </Label>
              {availableSoftSkills.length > 0 ? (
                <div className="max-h-48 overflow-y-auto border rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {availableSoftSkills.map(skill => (
                      <Button
                        key={skill}
                        variant={filters.softskills.includes(skill) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSoftSkillToggle(skill)}
                        className={`justify-start text-left ${
                          filters.softskills.includes(skill) ? "bg-blue-600 hover:bg-blue-700" : ""
                        }`}
                      >
                        {filters.softskills.includes(skill) && (
                          <Check className="w-3 h-3 mr-1 flex-shrink-0" />
                        )}
                        <span className="truncate">{skill}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Nenhuma soft skill disponível</p>
              )}
            </div>

            {/* Resumo dos Filtros Ativos */}
            {hasActiveFilters && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Filtros Ativos:</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  {filters.semestres.length > 0 && (
                    <p>• Semestres: {filters.semestres.map(s => s + 'º').join(', ')}</p>
                  )}
                  {filters.statusSolicitacoes !== 'todos' && (
                    <p>• Status: {filters.statusSolicitacoes === 'com_solicitacoes' ? 'Com solicitações' : 'Sem solicitações'}</p>
                  )}
                  {filters.aptidoes.length > 0 && (
                    <p>• Aptidões: {filters.aptidoes.slice(0, 3).join(', ')}{filters.aptidoes.length > 3 && ` +${filters.aptidoes.length - 3} mais`}</p>
                  )}
                  {filters.softskills.length > 0 && (
                    <p>• Soft Skills: {filters.softskills.slice(0, 3).join(', ')}{filters.softskills.length > 3 && ` +${filters.softskills.length - 3} mais`}</p>
                  )}
                  {(filters.idadeMin || filters.idadeMax) && (
                    <p>• Idade: {filters.idadeMin || '?'} - {filters.idadeMax || '?'} anos</p>
                  )}
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex-1"
                disabled={!hasActiveFilters}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpar Filtros
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Filter className="w-4 h-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 