export interface Reserva {
  id?: string;
  usuarioId: string;
  nomeContato: string;
  emailContato: string;
  telefoneContato: string;
  dataEvento: Date;
  horaInicio: string;
  horaFim: string;
  tipoEvento: string;
  numeroConvidados: number;
  valorTotal: number;
  status: StatusReserva;
  observacoes?: string;
  servicosExtras?: ServicoExtra[];
  dataCriacao: Date;
  dataUltimaAtualizacao: Date;
  pagamento?: {
    status: StatusPagamento;
    metodoPagamento: string;
    transacaoId?: string;
    dataPagamento?: Date;
  };
}

export enum StatusReserva {
  PENDENTE = 'pendente',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
  FINALIZADA = 'finalizada'
}

export enum StatusPagamento {
  PENDENTE = 'pendente',
  PAGO = 'pago',
  CANCELADO = 'cancelado',
  REEMBOLSADO = 'reembolsado'
}

export interface ServicoExtra {
  nome: string;
  descricao: string;
  valor: number;
  quantidade: number;
}

export interface DisponibilidadeData {
  data: Date;
  disponivel: boolean;
  horariosDisponiveis?: string[];
  reservas?: Reserva[];
}