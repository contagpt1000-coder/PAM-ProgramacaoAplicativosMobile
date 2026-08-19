import {
  Agendamento,
  Profissional,
  Servico,
  Categoria,
  Cliente,
  CriarAgendamentoDTO,
  AtualizarAgendamentoDTO,
} from '../types';

const INITIAL_CATEGORIAS: Categoria[] = [
  { id: '1', nome: 'Cortes & Cabelo', icone: 'content-cut' },
  { id: '2', nome: 'Barba & Terapia', icone: 'face-man-shave' },
  { id: '3', nome: 'Combos Exclusivos', icone: 'star' },
  { id: '4', nome: 'Estética & Pigmentação', icone: 'brush' },
];

const INITIAL_SERVICOS: Servico[] = [
  {
    id: '1',
    categoriaId: '1',
    nome: 'Corte de Cabelo Premium',
    descricao: 'Corte moderno com tesoura e máquina, finalização com pomada importada e lavagem.',
    preco: 55,
    duracaoMinutos: 45,
    imagemUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
  },
  {
    id: '2',
    categoriaId: '2',
    nome: 'Barba Completa com Toalha Quente',
    descricao: 'Modelagem de barba, esfoliação facial, alinhamento com navalha e hidratação com óleos essenciais.',
    preco: 45,
    duracaoMinutos: 35,
    imagemUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400',
  },
  {
    id: '3',
    categoriaId: '3',
    nome: 'Combo Barba & Cabelo',
    descricao: 'Experiência completa: Corte estilizado + barba completa com tratamento de toalha quente.',
    preco: 90,
    duracaoMinutos: 75,
    imagemUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
  },
  {
    id: '4',
    categoriaId: '4',
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

const INITIAL_CLIENTES: Cliente[] = [
  { id: '1', nome: 'Carlos Eduardo', telefone: '(11) 98765-4321', email: 'carlos.eduardo@email.com' },
  { id: '2', nome: 'Marcos Vinicius', telefone: '(11) 91234-5678', email: 'marcos.vinicius@email.com' },
  { id: '3', nome: 'Felipe Rocha', telefone: '(85) 99123-4567', email: 'felipe.rocha@email.com' },
  { id: '4', nome: 'Lucas Gabriel', telefone: '(11) 98765-4321', email: 'lucas.gabriel@email.com' },
];

const INITIAL_AGENDAMENTOS: Agendamento[] = [
  {
    id: '101',
    clienteId: '1',
    clienteNome: 'Carlos Eduardo',
    clienteTelefone: '(11) 98765-4321',
    servicoId: '1',
    profissionalId: '1',
    data: '2026-08-19',
    hora: '09:00',
    status: 'agendado',
    observacoes: 'Corte degradê navalhado.',
  },
  {
    id: '102',
    clienteId: '2',
    clienteNome: 'Marcos Vinicius',
    clienteTelefone: '(11) 91234-5678',
    servicoId: '3',
    profissionalId: '2',
    data: '2026-08-19',
    hora: '14:00',
    status: 'agendado',
    observacoes: 'Barboterapia com toalha quente.',
  },
  {
    id: '103',
    clienteId: '3',
    clienteNome: 'Felipe Rocha',
    clienteTelefone: '(85) 99123-4567',
    servicoId: '2',
    profissionalId: '3',
    data: '2026-08-05',
    hora: '16:00',
    status: 'cancelado',
    observacoes: 'Cliente solicitou cancelamento por imprevisto.',
  },
  {
    id: '104',
    clienteId: '4',
    clienteNome: 'Lucas Gabriel',
    clienteTelefone: '(11) 98765-4321',
    servicoId: '1',
    profissionalId: '1',
    data: '2026-08-19',
    hora: '10:00',
    status: 'agendado',
    observacoes: '',
  },
];

class MockFallbackStore {
  private categorias: Categoria[] = [...INITIAL_CATEGORIAS];
  private servicos: Servico[] = [...INITIAL_SERVICOS];
  private profissionais: Profissional[] = [...INITIAL_PROFISSIONAIS];
  private clientes: Cliente[] = [...INITIAL_CLIENTES];
  private agendamentos: Agendamento[] = [...INITIAL_AGENDAMENTOS];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedAg = window.localStorage.getItem('@barberflow_agendamentos_mock');
        if (savedAg) this.agendamentos = JSON.parse(savedAg);

        const savedCl = window.localStorage.getItem('@barberflow_clientes_mock');
        if (savedCl) this.clientes = JSON.parse(savedCl);
      } catch (e) {}
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('@barberflow_agendamentos_mock', JSON.stringify(this.agendamentos));
        window.localStorage.setItem('@barberflow_clientes_mock', JSON.stringify(this.clientes));
      } catch (e) {}
    }
  }

  async getCategorias(): Promise<Categoria[]> {
    return [...this.categorias];
  }

  async getServicos(): Promise<Servico[]> {
    return [...this.servicos];
  }

  async getProfissionais(): Promise<Profissional[]> {
    return [...this.profissionais];
  }

  async getClientes(): Promise<Cliente[]> {
    return [...this.clientes];
  }

  async findOrCreateCliente(nome: string, telefone: string): Promise<Cliente> {
    const existing = this.clientes.find(
      (c) => c.nome.toLowerCase() === nome.trim().toLowerCase() || c.telefone === telefone.trim()
    );
    if (existing) return existing;

    const newCliente: Cliente = {
      id: String(Date.now()).slice(-4),
      nome: nome.trim(),
      telefone: telefone.trim(),
    };
    this.clientes.push(newCliente);
    this.saveToStorage();
    return newCliente;
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
    const cliente = await this.findOrCreateCliente(data.clienteNome, data.clienteTelefone);
    const newId = String(Date.now()).slice(-6);
    const novo: Agendamento = {
      id: newId,
      clienteId: cliente.id,
      clienteNome: cliente.nome,
      clienteTelefone: cliente.telefone,
      servicoId: data.servicoId,
      profissionalId: data.profissionalId,
      data: data.data,
      hora: data.hora,
      status: 'agendado',
      observacoes: data.observacoes,
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
