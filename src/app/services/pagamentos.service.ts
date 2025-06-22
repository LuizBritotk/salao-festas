import { Injectable } from '@angular/core';
import { httpsCallable } from 'firebase/functions';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class PagamentosService {
  constructor(private firebase: FirebaseService) {}

  async criarPagamentoStripe(dadosPagamento: {
    reservaId: string;
    valor: number;
    metodoPagamento: string;
    dadosCliente: {
      nome: string;
      email: string;
      telefone: string;
    };
  }): Promise<{clientSecret: string}> {
    try {
      const criarPagamento = httpsCallable(this.firebase.functions, 'criarPagamentoStripe');
      const resultado = await criarPagamento(dadosPagamento);
      return resultado.data as {clientSecret: string};
    } catch (error) {
      console.error('Erro ao criar pagamento Stripe:', error);
      throw error;
    }
  }

  async criarPagamentoMercadoPago(dadosPagamento: {
    reservaId: string;
    valor: number;
    descricao: string;
    dadosCliente: {
      nome: string;
      email: string;
      telefone: string;
    };
  }): Promise<{preferenceId: string, initPoint: string}> {
    try {
      const criarPagamento = httpsCallable(this.firebase.functions, 'criarPagamentoMercadoPago');
      const resultado = await criarPagamento(dadosPagamento);
      return resultado.data as {preferenceId: string, initPoint: string};
    } catch (error) {
      console.error('Erro ao criar pagamento MercadoPago:', error);
      throw error;
    }
  }

  async verificarStatusPagamento(transacaoId: string, provedor: 'stripe' | 'mercadopago'): Promise<{
    status: 'pendente' | 'pago' | 'cancelado' | 'falhado';
    transacaoId: string;
    valor?: number;
    dataPagamento?: Date;
  }> {
    try {
      const verificarStatus = httpsCallable(this.firebase.functions, 'verificarStatusPagamento');
      const resultado = await verificarStatus({ transacaoId, provedor });
      return resultado.data as any;
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      throw error;
    }
  }

  async processarReembolso(transacaoId: string, valor: number, provedor: 'stripe' | 'mercadopago'): Promise<{
    sucesso: boolean;
    reembolsoId?: string;
    mensagem: string;
  }> {
    try {
      const processarReembolso = httpsCallable(this.firebase.functions, 'processarReembolso');
      const resultado = await processarReembolso({ transacaoId, valor, provedor });
      return resultado.data as any;
    } catch (error) {
      console.error('Erro ao processar reembolso:', error);
      throw error;
    }
  }
}