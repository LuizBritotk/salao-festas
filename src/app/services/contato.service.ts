import { Injectable } from '@angular/core';
import { 
  collection, 
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { CriptografiaService } from './criptografia.service';
import { MensagemContato } from '../interfaces/contato.interface';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  private readonly colecaoContatos = 'contatos';

  constructor(
    private firebase: FirebaseService,
    private criptografia: CriptografiaService
  ) {}

  async enviarMensagemContato(mensagem: Omit<MensagemContato, 'id' | 'dataEnvio' | 'respondida'>): Promise<void> {
    try {
      const mensagemParaSalvar = {
        nome: mensagem.nome,
        email: this.criptografia.criptografarDadoReversivel(mensagem.email),
        telefone: this.criptografia.criptografarDadoReversivel(mensagem.telefone),
        assunto: mensagem.assunto,
        mensagem: mensagem.mensagem,
        consentimentoLGPD: mensagem.consentimentoLGPD,
        dataEnvio: Timestamp.fromDate(new Date()),
        respondida: false
      };

      await addDoc(collection(this.firebase.firestore, this.colecaoContatos), mensagemParaSalvar);
    } catch (error) {
      console.error('Erro ao enviar mensagem de contato:', error);
      throw error;
    }
  }
}