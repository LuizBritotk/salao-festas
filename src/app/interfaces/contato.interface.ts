export interface MensagemContato {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
  consentimentoLGPD: boolean;
  dataEnvio: Date;
  respondida: boolean;
  dataResposta?: Date;
  resposta?: string;
}