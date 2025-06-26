import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tela-inicial',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
     <!-- Logo no canto superior esquerdo -->
       <div class="absolute z-10">
      <img src="assets/images/logo-espaco-elias-sem-fundo.png" alt="Logo Espaço Elias" class="h-[15rem] w-[15rem]">
    </div>
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img 
          src="assets/images/foto-salao-decorado.jpg" 
          alt="Salão de Festas Elegante"
          class="w-full h-full object-cover"
        >
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      <div class="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
          Bem-vindo ao 
          <span class="bg-gradient-to-r from-dourado-400 to-dourado-600 bg-clip-text text-transparent">
            Espaço Elias
          </span>
        </h1>

        <p class="text-xl sm:text-2xl mb-8 animate-fade-in text-gray-200 max-w-3xl mx-auto">
          Um salão de festas amplo e acolhedor, perfeito para transformar seus momentos especiais em memórias inesquecíveis.  
          Com 300m² de estrutura, o Espaço Elias oferece elegância, conforto e tudo o que você precisa para comemorar com tranquilidade e segurança.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <a routerLink="/agendamento" 
            class="btn-primary text-lg px-8 py-4 hover:scale-110 transform transition-all duration-300">
            <i class="pi pi-calendar mr-2"></i>
            Faça sua Reserva
          </a>
          <a routerLink="/fotos" 
            class="btn-secondary text-lg px-8 py-4 hover:scale-110 transform transition-all duration-300">
            <i class="pi pi-images mr-2"></i>
            Ver Galeria
          </a>
        </div>
      </div>


      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce-subtle">
        <i class="pi pi-chevron-down text-2xl"></i>
      </div>
    </section>

    <!-- Seção Sobre -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="fade-in">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Sua Festa dos Sonhos
              <span class="text-dourado-600"> Acontece Aqui</span>
            </h2>
            <p class="text-lg text-gray-600 mb-6">
              Com mais de 10 anos de experiência, o Salão do Elias é referência 
              em eventos sociais em São Paulo. Nossa estrutura completa e equipe 
              especializada garantem que seu evento seja perfeito em cada detalhe.
            </p>
            
            <div class="grid grid-cols-2 gap-6 mb-8">
              <div class="text-center">
                <div class="text-3xl font-bold text-dourado-600 mb-2">500+</div>
                <div class="text-gray-600">Eventos Realizados</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-dourado-600 mb-2">15</div>
                <div class="text-gray-600">Anos de Experiência</div>
              </div>
            </div>

            <a routerLink="/contato" 
               class="btn-primary inline-flex items-center">
              <i class="pi pi-phone mr-2"></i>
              Entre em Contato
            </a>
          </div>
          
          <div class="fade-in">
            <div class="grid grid-cols-2 gap-4">
              <img 
                src="assets/images/foto-salao-decorado.jpg" 
                alt="Ambiente interno do salão"
                class="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
              <img 
                src="assets/images/foto-mesa-decorado.jpg" 
                alt="Mesa decorada para festa"
                class="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mt-8"
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção Diferenciais -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Por que Escolher o Salão do Elias?
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Oferecemos tudo que você precisa para tornar seu evento único e memorável
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ng-container *ngFor="let card of diferencialCards">
            <div class="card-hover bg-white p-6 rounded-lg shadow-lg text-center fade-in">
              <div [ngClass]="card.bg" class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i [ngClass]="card.icon" class="text-2xl"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ card.title }}</h3>
              <p class="text-gray-600">{{ card.description }}</p>
            </div>
          </ng-container>
        </div>
      </div>
    </section>

    <!-- Seção Galeria de Fotos -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Galeria de Fotos
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Confira os ambientes, decorações e detalhes do Salão do Elias.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <ng-container *ngFor="let foto of galeriaFotos">
            <div class="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-gray-50">
              <img 
                [src]="foto.url" 
                [alt]="foto.nome" 
                class="w-full h-48 object-cover"
              >
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ foto.nome }}</h3>
                <p class="text-sm text-gray-500 uppercase tracking-wide">{{ foto.categoria }}</p>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 bg-gradient-to-r from-dourado-600 to-dourado-700">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
          Pronto para Começar a Planejar?
        </h2>
        <p class="text-xl text-dourado-100 mb-8">
          Entre em contato conosco e vamos transformar sua visão em realidade. 
          Agende uma visita ou solicite um orçamento sem compromisso.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/agendamento" class="bg-white text-dourado-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
            <i class="pi pi-calendar mr-2"></i> Agendar Visita
          </a>
          <a routerLink="/contato" class="border-2 border-white text-white hover:bg-white hover:text-dourado-600 font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
            <i class="pi pi-phone mr-2"></i> Solicitar Orçamento
          </a>
        </div>
      </div>
    </section>

    <!-- Depoimentos -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            O que Nossos Clientes Dizem
          </h2>
          <p class="text-lg text-gray-600">
            Veja alguns depoimentos de quem já realizou seu evento conosco
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ng-container *ngFor="let depoimento of depoimentos">
            <div class="card-hover bg-gray-50 p-6 rounded-lg fade-in">
              <div class="flex items-center mb-4">
                <div class="flex text-dourado-400">
                  <i class="pi pi-star-fill" *ngFor="let star of [1,2,3,4,5]"></i>
                </div>
              </div>
              <p class="text-gray-600 mb-4 italic">"{{ depoimento.mensagem }}"</p>
              <div class="font-semibold text-gray-900">{{ depoimento.nome }}</div>
              <div class="text-sm text-gray-500">{{ depoimento.tipoEvento }}</div>
            </div>
          </ng-container>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .fade-in {
      animation: fadeIn 1s ease-in forwards;
      opacity: 0;
    }
    .animate-fade-in {
      animation: fadeIn 1s ease-in forwards;
      opacity: 0;
    }
    .animate-slide-up {
      animation: slideUp 1s ease-out forwards;
      opacity: 0;
      transform: translateY(20px);
    }
    .animate-bounce-subtle {
      animation: bounceSubtle 2s infinite ease-in-out;
    }
    @keyframes fadeIn {
      to { opacity: 1; }
    }
    @keyframes slideUp {
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes bounceSubtle {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(10%); }
    }
    .btn-primary {
      background-color: #B8860B; /* dourado */
      color: white;
      border-radius: 0.5rem;
      font-weight: 600;
      box-shadow: 0 4px 6px rgba(184,134,11,0.4);
      transition: background-color 0.3s ease;
    }
    .btn-primary:hover {
      background-color: #996515;
    }
    .btn-secondary {
      background-color: transparent;
      color: #B8860B;
      border: 2px solid #B8860B;
      border-radius: 0.5rem;
      font-weight: 600;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    .btn-secondary:hover {
      background-color: #B8860B;
      color: white;
    }
    .card-hover:hover {
      box-shadow: 0 10px 15px rgba(0,0,0,0.15);
      transform: translateY(-5px);
      transition: box-shadow 0.3s ease, transform 0.3s ease;
    }
  `]
})
export class TelaInicialComponent implements OnInit {
  diferencialCards = [
  {
    title: 'Estrutura Completa e Funcional',
    description: '300m² de área com churrasqueira, cozinha espaçosa, freezer, micro-ondas, 2 banheiros e área externa com excelente circulação.',
    icon: 'pi pi-building',
    bg: 'bg-gradient-to-r from-dourado-300 to-dourado-500 text-white'
  },
  {
    title: 'Conforto para Todos',
    description: 'Sacada ampla para até 20 pessoas, 120 mesas e 30 cadeiras disponíveis. Espaço acolhedor e seguro para todas as idades.',
    icon: 'pi pi-users',
    bg: 'bg-gradient-to-r from-dourado-300 to-dourado-500 text-white'
  },
  {
    title: 'Diversão Garantida',
    description: 'Área kids com pula-pula e piscina de bolinhas para alegrar as crianças durante o evento.',
    icon: 'pi pi-smile',
    bg: 'bg-gradient-to-r from-dourado-300 to-dourado-500 text-white'
  },
  {
    title: 'Ambiente Seguro',
    description: 'Acesso com escada protegido por porta de segurança, garantindo tranquilidade para famílias com crianças e idosos.',
    icon: 'pi pi-shield',
    bg: 'bg-gradient-to-r from-dourado-300 to-dourado-500 text-white'
  },
  {
    title: 'Localização de Fácil Acesso',
    description: 'Situado na Vila Aparecida - Zona Leste de SP, com acesso prático e ambiente seguro para seus convidados.',
    icon: 'pi pi-map-marker',
    bg: 'bg-gradient-to-r from-dourado-300 to-dourado-500 text-white'
  }
];


  galeriaFotos = [
    { nome: 'Salão Decorado', categoria: 'Ambiente', url: 'assets/images/foto-salao-decorado.jpg' },
    { nome: 'Mesa Decorada', categoria: 'Decoração', url: 'assets/images/foto-mesa-decorado.jpg' },
    { nome: 'Área da Churrasqueira', categoria: 'Ambiente', url: 'assets/images/foto-churrasqueira-refrigerador.jpg' },
    { nome: 'Churrasqueira Dupla', categoria: 'Detalhes', url: 'assets/images/foto-churrasqueira-dupla.jpg' },
    { nome: 'Salão com Mesas e Brinquedos', categoria: 'Ambiente', url: 'assets/images/foto-salao-dupla-mesas-brinquedos.jpg' },
    { nome: 'Vista da Sacada', categoria: 'Ambiente', url: 'assets/images/foto-salao-sacada.jpg' }
  ];
depoimentos = [
  {
    nome: 'Maria Silva',
    mensagem: 'Foi tudo impecável! Desde a estrutura até a atenção da equipe. O espaço foi o cenário perfeito para o nosso casamento. Não poderíamos ter escolhido melhor!',
    tipoEvento: 'Casamento'
  },
  {
    nome: 'João Pereira',
    mensagem: 'Meu aniversário foi simplesmente inesquecível! As crianças amaram o pula-pula e a piscina de bolinhas. Todos os convidados elogiaram o ambiente!',
    tipoEvento: 'Aniversário'
  },
  {
    nome: 'Ana Costa',
    mensagem: 'Realizamos um evento corporativo com mais de 50 pessoas e tudo saiu conforme planejado. Ambiente organizado, banheiros limpos e cozinha super funcional!',
    tipoEvento: 'Evento Corporativo'
  },
  {
    nome: 'Larissa Mendes',
    mensagem: 'Reservei para o batizado do meu filho e fui surpreendida positivamente. A sacada foi um charme à parte e o espaço garantiu conforto para toda a família.',
    tipoEvento: 'Batizado'
  },
  {
    nome: 'Carlos Eduardo',
    mensagem: 'Já participei de três eventos no Espaço Elias e em todos fui muito bem recebido. Estrutura ótima e localização excelente. Recomendo de olhos fechados!',
    tipoEvento: 'Convidado Frequente'
  }
];


  constructor() { }

  ngOnInit(): void {
  }
}
