export interface Parceiro {
  id?: string;
  nome: string;
  descricao: string;
  categoria: CategoriaParceiro;
  telefone: string;
  whatsapp?: string;
  email: string;
  website?: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  logoUrl?: string;
  fotosGaleria?: string[];
  avaliacaoMedia?: number;
  ativo: boolean;
  dataCriacao: Date;
  dataUltimaAtualizacao: Date;
}

export enum CategoriaParceiro {
  BUFFET = 'buffet',
  DECORACAO = 'decoracao',
  FOTOGRAFIA = 'fotografia',
  MUSICA_DJ = 'musica_dj',
  FLORICULTURA = 'floricultura',
  DOCES_BOLOS = 'doces_bolos',
  SEGURANCA = 'seguranca',
  LIMPEZA = 'limpeza',
  TRANSPORTE = 'transporte',
  OUTROS = 'outros'
}