import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContatoService } from '../../services/contato.service';

@Component({
  selector: 'app-tela-contato',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">
              Entre em 
              <span class="text-dourado-600">Contato</span>
            </h1>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Estamos aqui para ajudar você a planejar seu evento perfeito. 
              Entre em contato conosco e vamos conversar sobre seus sonhos.
            </p>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Formulário de Contato -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Envie sua Mensagem</h2>
            
            <form [formGroup]="formularioContato" (ngSubmit)="enviarMensagem()">
              <!-- Nome -->
              <div class="mb-6">
                <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="nome"
                  formControlName="nome"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dourado-500 focus:border-transparent transition-all duration-200"
                  placeholder="Seu nome completo"
                >
                <div *ngIf="formularioContato.get('nome')?.invalid && formularioContato.get('nome')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Nome é obrigatório
                </div>
              </div>

              <!-- Email -->
              <div class="mb-6">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  formControlName="email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dourado-500 focus:border-transparent transition-all duration-200"
                  placeholder="seu@email.com"
                >
                <div *ngIf="formularioContato.get('email')?.invalid && formularioContato.get('email')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  <span *ngIf="formularioContato.get('email')?.errors?.['required']">E-mail é obrigatório</span>
                  <span *ngIf="formularioContato.get('email')?.errors?.['email']">E-mail inválido</span>
                </div>
              </div>

              <!-- Telefone -->
              <div class="mb-6">
                <label for="telefone" class="block text-sm font-medium text-gray-700 mb-2">
                  Telefone/WhatsApp *
                </label>
                <input
                  type="tel"
                  id="telefone"
                  formControlName="telefone"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dourado-500 focus:border-transparent transition-all duration-200"
                  placeholder="(11) 99999-9999"
                >
                <div *ngIf="formularioContato.get('telefone')?.invalid && formularioContato.get('telefone')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Telefone é obrigatório
                </div>
              </div>

              <!-- Assunto -->
              <div class="mb-6">
                <label for="assunto" class="block text-sm font-medium text-gray-700 mb-2">
                  Assunto *
                </label>
                <select
                  id="assunto"
                  formControlName="assunto"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dourado-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="orcamento">Solicitação de Orçamento</option>
                  <option value="agendamento">Agendamento de Visita</option>
                  <option value="informacoes">Informações Gerais</option>
                  <option value="parcerias">Parcerias</option>
                  <option value="outros">Outros</option>
                </select>
                <div *ngIf="formularioContato.get('assunto')?.invalid && formularioContato.get('assunto')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Assunto é obrigatório
                </div>
              </div>

              <!-- Mensagem -->
              <div class="mb-6">
                <label for="mensagem" class="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem *
                </label>
                <textarea
                  id="mensagem"
                  formControlName="mensagem"
                  rows="5"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dourado-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Conte-nos mais sobre seu evento..."
                ></textarea>
                <div *ngIf="formularioContato.get('mensagem')?.invalid && formularioContato.get('mensagem')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Mensagem é obrigatória
                </div>
              </div>

              <!-- LGPD Consent -->
              <div class="mb-6">
                <label class="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    formControlName="consentimentoLGPD"
                    class="mt-1 h-4 w-4 text-dourado-600 focus:ring-dourado-500 border-gray-300 rounded"
                  >
                  <span class="text-sm text-gray-600">
                    Concordo com o tratamento dos meus dados pessoais de acordo com a 
                    <a href="/lgpd" target="_blank" class="text-dourado-600 hover:text-dourado-700 underline">
                      Lei Geral de Proteção de Dados (LGPD)
                    </a> 
                    e autorizo o contato para resposta da minha solicitação. *
                  </span>
                </label>
                <div *ngIf="formularioContato.get('consentimentoLGPD')?.invalid && formularioContato.get('consentimentoLGPD')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Consentimento LGPD é obrigatório
                </div>
              </div>

              <!-- Botão Enviar -->
              <button
                type="submit"
                [disabled]="formularioContato.invalid || enviando"
                class="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div *ngIf="enviando" class="spinner mr-2 w-4 h-4"></div>
                <i *ngIf="!enviando" class="pi pi-send mr-2"></i>
                {{ enviando ? 'Enviando...' : 'Enviar Mensagem' }}
              </button>
            </form>

            <!-- Mensagem de Sucesso -->
            <div *ngIf="mensagemEnviada" 
                 class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center">
                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                <span class="text-green-700 font-medium">
                  Mensagem enviada com sucesso! Entraremos em contato em breve.
                </span>
              </div>
            </div>

            <!-- Mensagem de Erro -->
            <div *ngIf="erroEnvio" 
                 class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center">
                <i class="pi pi-exclamation-triangle text-red-500 mr-2"></i>
                <span class="text-red-700 font-medium">
                  Erro ao enviar mensagem. Tente novamente.
                </span>
              </div>
            </div>
          </div>

          <!-- Informações de Contato -->
          <div class="space-y-8">
            <!-- Endereço -->
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Nosso Endereço</h3>
              <div class="space-y-4">
                <div class="flex items-start space-x-3">
                  <i class="pi pi-map-marker text-dourado-600 mt-1"></i>
                  <div>
                    <p class="font-medium text-gray-900">Salão Imperial</p>
                    <p class="text-gray-600">
                      Rua das Festas, 123<br>
                      Centro - São Paulo/SP<br>
                      CEP: 01234-567
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contato Direto -->
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Contato Direto</h3>
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <i class="pi pi-phone text-dourado-600"></i>
                  <div>
                    <p class="font-medium text-gray-900">Telefone</p>
                    <p class="text-gray-600">(11) 99999-9999</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <i class="pi pi-whatsapp text-dourado-600"></i>
                  <div>
                    <p class="font-medium text-gray-900">WhatsApp</p>
                    <p class="text-gray-600">(11) 99999-9999</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <i class="pi pi-envelope text-dourado-600"></i>
                  <div>
                    <p class="font-medium text-gray-900">E-mail</p>
                    <p class="text-gray-600">contato&#64;salao-imperial.com.br</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Horário de Funcionamento -->
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Horário de Atendimento</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Segunda a Sexta</span>
                  <span class="font-medium text-gray-900">8h às 18h</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Sábado</span>
                  <span class="font-medium text-gray-900">8h às 16h</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Domingo</span>
                  <span class="font-medium text-gray-900">Fechado</span>
                </div>
              </div>
            </div>

            <!-- Redes Sociais -->
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Siga-nos</h3>
              <div class="flex space-x-4">
                <a href="https://facebook.com" target="_blank" 
                   class="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200">
                  <i class="pi pi-facebook text-xl"></i>
                </a>
                <a href="https://instagram.com" target="_blank" 
                   class="flex items-center justify-center w-12 h-12 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors duration-200">
                  <i class="pi pi-instagram text-xl"></i>
                </a>
                <a href="https://whatsapp.com" target="_blank" 
                   class="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200">
                  <i class="pi pi-whatsapp text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TelaContatoComponent {
  formularioContato: FormGroup;
  enviando = false;
  mensagemEnviada = false;
  erroEnvio = false;

  constructor(
    private fb: FormBuilder,
    private contatoService: ContatoService
  ) {
    this.formularioContato = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      assunto: ['', [Validators.required]],
      mensagem: ['', [Validators.required]],
      consentimentoLGPD: [false, [Validators.requiredTrue]]
    });
  }

  async enviarMensagem() {
    if (this.formularioContato.valid) {
      try {
        this.enviando = true;
        this.erroEnvio = false;
        
        await this.contatoService.enviarMensagemContato(this.formularioContato.value);
        
        this.mensagemEnviada = true;
        this.formularioContato.reset();
        
        // Ocultar mensagem de sucesso após 5 segundos
        setTimeout(() => {
          this.mensagemEnviada = false;
        }, 5000);
        
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        this.erroEnvio = true;
      } finally {
        this.enviando = false;
      }
    }
  }
}