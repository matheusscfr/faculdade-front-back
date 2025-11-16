"use client";
import { useState } from "react";
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
import { 
  Mail, 
  Phone, 
  Linkedin, 
  Copy, 
  Check,
  User,
  ExternalLink
} from "lucide-react";

interface ContactModalProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactModal({
  student,
  open,
  onOpenChange,
}: ContactModalProps) {
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({});

  if (!student) return null;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => ({ ...prev, [type]: true }));
      
      // Resetar o estado de copiado após 2 segundos
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const contactItems = [
    {
      type: 'email',
      label: 'Email',
      value: student.email,
      icon: <Mail className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
  ];

  // Adicionar telefone se disponível
  if (student.telefone) {
    contactItems.push({
      type: 'phone',
      label: 'Telefone',
      value: student.telefone,
      icon: <Phone className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    });
  }

  // Adicionar LinkedIn se disponível
  if (student.linkedin) {
    contactItems.push({
      type: 'linkedin',
      label: 'LinkedIn',
      value: student.linkedin,
      icon: <Linkedin className="w-5 h-5" />,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden fixed top-[50%] left-[50%] translate-x-[-50%]">  
        <div className="overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogClose onClose={() => onOpenChange(false)} />
            <DialogTitle className="text-xl font-bold flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Informações de Contato</span>
            </DialogTitle>
            <DialogDescription>
              Entre em contato com {student.nome}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4">
            {/* Informações do Aluno */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-1">{student.nome}</h3>
              <p className="text-sm text-gray-600">{student.curso} • {student.semestre_atual}º Semestre</p>
              <p className="text-xs text-gray-500">Matrícula: {student.matricula}</p>
            </div>

            {/* Lista de Contatos */}
            <div className="space-y-3">
              {contactItems.map((item) => (
                <div 
                  key={item.type}
                  className={`${item.bgColor} ${item.borderColor} border rounded-lg p-4 transition-all hover:shadow-sm`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`${item.color}`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700">{item.label}</p>
                        <p className="text-sm text-gray-900 truncate" title={item.value}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {/* Botão de copiar */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(item.value, item.type)}
                        className="h-8 w-8 p-0"
                        title={`Copiar ${item.label.toLowerCase()}`}
                      >
                        {copiedItems[item.type] ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                      
                      {/* Botão de abrir link (apenas para LinkedIn) */}
                      {item.type === 'linkedin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(item.value, '_blank')}
                          className="h-8 w-8 p-0"
                          title="Abrir LinkedIn"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                      
                      {/* Botão de abrir email */}
                      {item.type === 'email' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`mailto:${item.value}`, '_blank')}
                          className="h-8 w-8 p-0"
                          title="Enviar email"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                      
                      {/* Botão de ligar */}
                      {item.type === 'phone' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${item.value}`, '_blank')}
                          className="h-8 w-8 p-0"
                          title="Ligar"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Feedback de copiado */}
                  {copiedItems[item.type] && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      ✓ {item.label} copiado!
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Informações adicionais */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Clique nos ícones de cópia para copiar as informações ou nos ícones de link para abrir diretamente
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 