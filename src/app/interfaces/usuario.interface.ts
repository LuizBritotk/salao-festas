export interface Usuario {
  id?: string;
  nome: string;
  email: string;
  emailCriptografado?: string;
  telefone: string;
  telefoneCriptografado?: string;
  dataCriacao: Date;
  ultimoLogin?: Date;
  consentimentoLGPD: boolean;
  dataConsentimentoLGPD: Date;
}

export interface PerfilUsuario extends Usuario {
  endereco?: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  preferencias?: {
    notificacoesPorEmail: boolean;
    notificacoesPorSMS: boolean;
    marketingEmail: boolean;
  };
}