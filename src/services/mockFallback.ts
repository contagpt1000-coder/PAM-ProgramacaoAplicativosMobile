import { Agendamento, Profissional, Servico, CriarAgendamentoDTO, AtualizarAgendamentoDTO } from '../types';

// Banco de dados embutido para contingência (Offline / Fallback Inteligente)
// Garante funcionamento 100% mesmo se o backend json-server não for iniciado na escola/apresentação.
const INITIAL_SERVICOS: Servico[] = [
  {
    id: '1',
    nome: 'Corte de Cabelo Premium',
    descricao: 'Corte moderno com tesoura e máquina, finalização com pomada importada e lavagem.',
    preco: 55,
    duracaoMinutos: 45,
    imagemUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
  },
  {
    id: '2',
    nome: 'Barba Completa com Toalha Quente',
    descricao: 'Modelagem de barba, esfoliação facial, alinhamento com navalha e hidratação com óleos essenciais.',
    preco: 45,
    duracaoMinutos: 35,
    imagemUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400',
  },
  {
    id: '3',
    nome: 'Combo Barba & Cabelo',
    descricao: 'Experiência completa: Corte estilizado + barba completa com tratamento de toalha quente.',
    preco: 90,
    duracaoMinutos: 75,
    imagemUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
  },
  {
    id: '4',
    nome: 'Pigmentação de Barba',
    descricao: 'Preenchimento de falhas e alinhamento de contorno da barba com tinta hipoalergênica.',
    preco: 35,
    duracaoMinutos: 30,
    imagemUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400',
  },
];

const INITIAL_PROFISSIONAIS: Profissional[] = [
  {
    id: '1',
    nome: 'Carlos Silva (Mestre Barbeiro)',
    especialidade: 'Cortes Clássicos e Fade',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  },
  {
    id: '2',
    nome: 'Rafael Oliveira',
    especialidade: 'Barboterapia e Visagismo',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  },
  {
    id: '3',
    nome: 'Lucas Mendes',
    especialidade: 'Colorimetria e Químicas',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  },
];

const INITIAL_AGENDAMENTOS: Agendamento[] = [
  {
    id: '101',
    clienteNome: 'Carlos Eduardo',
    clienteTelefone: '(11) 98765-4321',
    servicoId: '1',
    profissionalId: '1',
    data: '2026-08-10',
    hora: '09:00',
    status: 'agendado',
    observacoes: 'Cliente prefere corte degradê navalhado.',
  },
  {
    id: '102',
    clienteNome: 'Marcos Vinicius',
    clienteTelefone: '(11) 91234-5678',
    servicoId: '3',
    profissionalId: '2',
    data: '2026-08-10',
    hora: '14:00',
    status: 'agendado',
    observacoes: 'Barboterapia com toalha quente e alinhamento.',
  },
  {
    id: '103',
    clienteNome: 'Felipe Rocha',
    clienteTelefone: '(85) 99123-4567',
    servicoId: '2',
    profissionalId: '3',
    data: '2026-08-05',
    hora: '16:00',
    status: 'cancelado',
    observacoes: 'Cliente solicitou cancelamento por imprevisto de trabalho.',
  },
  {
    id: '104',
    clienteNome: 'Gabriel Santos',
    clienteTelefone: '(15) 98877-6655',
    servicoId: '1',
    profissionalId: '1',
    data: '2026-08-09',
    hora: '10:00',
    status: 'concluido',
    observacoes: 'Corte finalizado com sucesso.',
  },
];

class MockFallbackStore {
  private servicos: Servico[] = [...INITIAL_SERVICOS];
  private profissionais: Profissional[] = [...INITIAL_PROFISSIONAIS];
  private agendamentos: Agendamento[] = [...INITIAL_AGENDAMENTOS];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem('@barberflow_agendamentos_mock');
        if (saved) {
          this.agendamentos = JSON.parse(saved);
        }
      } catch (e) {
        // Ignora falhas de leitura
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('@barberflow_agendamentos_mock', JSON.stringify(this.agendamentos));
      } catch (e) {
        // Ignora falhas de gravação
      }
    }
  }

  async getServicos(): Promise<Servico[]> {
    return [...this.servicos];
  }

  async getProfissionais(): Promise<Profissional[]> {
    return [...this.profissionais];
  }

  async getAgendamentos(statusFilter?: string, dataFilter?: string): Promise<Agendamento[]> {
    let result = [...this.agendamentos];
    if (statusFilter && statusFilter !== 'todos') {
      result = result.filter((a) => a.status === statusFilter);
    }
    if (dataFilter) {
      result = result.filter((a) => a.data === dataFilter);
    }
    return result;
  }

  async getAgendamentoById(id: string): Promise<Agendamento | undefined> {
    return this.agendamentos.find((a) => String(a.id) === String(id));
  }

  async createAgendamento(data: CriarAgendamentoDTO): Promise<Agendamento> {
    const newId = String(Date.now()).slice(-6);
    const novo: Agendamento = {
      ...data,
      id: newId,
      status: 'agendado',
    };
    this.agendamentos.unshift(novo);
    this.saveToStorage();
    return novo;
  }

  async updateAgendamento(id: string, data: AtualizarAgendamentoDTO): Promise<Agendamento> {
    const index = this.agendamentos.findIndex((a) => String(a.id) === String(id));
    if (index === -1) {
      throw new Error(`Agendamento #${id} não encontrado no banco local.`);
    }
    const updated: Agendamento = {
      ...this.agendamentos[index],
      ...data,
    };
    this.agendamentos[index] = updated;
    this.saveToStorage();
    return updated;
  }

  async deleteAgendamento(id: string): Promise<void> {
    this.agendamentos = this.agendamentos.filter((a) => String(a.id) !== String(id));
    this.saveToStorage();
  }
}

export const mockFallbackStore = new MockFallbackStore();
