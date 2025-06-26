import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tela-pagamento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div class="bg-white rounded-xl shadow-lg max-w-xl w-full p-10 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Obrigado pela sua <span class="text-dourado-600">Reserva</span>!
        </h1>
        <p class="text-gray-600 mb-6">
          Sua solicitação foi registrada com sucesso e está com status <strong>pendente</strong>.
        </p>
        <p class="text-gray-600 mb-6">
          Para concluir, clique no botão abaixo para efetuar o <strong>pagamento</strong> via Pix ou outro método disponível.
        </p>

        <!-- Simulação de botão de pagamento -->
        <button
          class="btn-primary w-full flex items-center justify-center mb-4"
          (click)="efetuarPagamento()">
          <i class="pi pi-credit-card mr-2"></i> Efetuar Pagamento
        </button>

        <a routerLink="/" class="text-sm text-dourado-600 hover:underline">
          ← Voltar à tela inicial
        </a>
      </div>
    </div>
  `,
  styles: [`
    .btn-primary {
      @apply bg-dourado-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform duration-200;
    }

    .btn-primary:hover {
      @apply bg-dourado-600 transform scale-105;
    }
  `]
})
export class TelaPagamentoComponent {
  efetuarPagamento() {
    // Aqui você pode redirecionar para o MercadoPago, Stripe ou outro gateway
    alert('Redirecionando para o pagamento...');
  }
}
