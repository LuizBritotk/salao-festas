import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FotosService } from '../../services/fotos.service';

@Component({
  selector: 'app-tela-fotos',
  standalone: true,
  imports: [CommonModule],
   template: `<div class="container">
  <!-- Header -->
  <div class="header">
    <div class="header-content">
      <h1 class="title">
        Galeria do <span class="highlight">Espaço Elias</span>
      </h1>
      <p class="subtitle">
        Explore os espaços e decorações incríveis para o seu evento!
      </p>
    </div>
  </div>

  <!-- Filtro de Categorias -->
  <div class="categorias">
    <button 
      *ngFor="let categoria of categorias"
      (click)="filtrarPorCategoria(categoria.valor)"
      [class.ativo]="categoriaAtiva === categoria.valor">
      {{ categoria.label }}
    </button>
  </div>

  <!-- Galeria -->
  <div *ngIf="!carregando" class="grid-fotos">
    <div *ngFor="let foto of fotosFiltradas; let i = index"
         class="card-foto"
         (click)="abrirModal(i)">
      <img [src]="foto.url" [alt]="foto.nome" loading="lazy" />
      <div class="overlay">
        <i class="pi pi-search-plus"></i>
      </div>
    </div>
  </div>

  <!-- Nenhuma foto -->
  <div *ngIf="fotosFiltradas.length === 0 && !carregando" class="sem-fotos">
    <i class="pi pi-image"></i>
    <p>Nenhuma foto encontrada para esta categoria.</p>
  </div>

  <!-- Carregando -->
  <div *ngIf="carregando" class="carregando">
    <div class="spinner"></div>
  </div>

  <!-- Modal -->
  <div *ngIf="modalAberto" class="modal-backdrop" (click)="fecharModal()">
    <div class="modal-conteudo" (click)="$event.stopPropagation()">
      <button class="btn-fechar" (click)="fecharModal()">&times;</button>

      <button *ngIf="indiceAtual > 0" class="btn-nav left" (click)="navegarFoto(-1)">
        <i class="pi pi-chevron-left"></i>
      </button>

      <img [src]="fotosFiltradas[indiceAtual].url" [alt]="fotosFiltradas[indiceAtual].nome" class="imagem-modal" />

      <button *ngIf="indiceAtual < fotosFiltradas.length - 1" class="btn-nav right" (click)="navegarFoto(1)">
        <i class="pi pi-chevron-right"></i>
      </button>

      <div class="legenda-modal">
        <h3>{{ fotosFiltradas[indiceAtual].nome }}</h3>
        <p>{{ indiceAtual + 1 }} de {{ fotosFiltradas.length }}</p>
      </div>
    </div>
  </div>

  <!-- Rodapé -->
  <footer class="rodape">
    © 2018 Espaço Elias. Todos os direitos reservados.
  </footer>
</div>

  `,
  styles: [`.container {
  @apply min-h-screen bg-gray-50 py-10 px-6;
}

.header .title {
  @apply text-4xl font-bold text-center text-gray-800;
}

.highlight {
  @apply text-dourado-600;
}

.subtitle {
  @apply text-center text-gray-500 mt-2 max-w-2xl mx-auto;
}

.categorias {
  @apply flex flex-wrap justify-center gap-3 mt-6;
}

.categorias button {
  @apply bg-white border border-dourado-500 text-dourado-600 px-4 py-2 rounded-full hover:bg-dourado-500 hover:text-white transition;
}

.categorias button.ativo {
  @apply bg-dourado-500 text-white;
}

.grid-fotos {
  @apply mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4;
}

.card-foto {
  @apply relative cursor-pointer overflow-hidden rounded-lg shadow;
}

.card-foto img {
  @apply w-full h-48 object-cover transition-transform duration-300 hover:scale-105;
}

.overlay {
  @apply absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition;
}

.overlay i {
  @apply text-white text-xl;
}

.sem-fotos {
  @apply mt-10 text-center text-gray-500;
}

.carregando {
  @apply flex justify-center mt-10;
}

.spinner {
  @apply w-6 h-6 border-4 border-gray-300 border-t-dourado-500 rounded-full animate-spin;
}

.modal-backdrop {
  @apply fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50;
}

.modal-conteudo {
  @apply relative bg-white rounded-xl p-6 shadow-lg max-w-3xl w-full;
}

.imagem-modal {
  @apply w-full rounded-md;
}

.btn-fechar {
  @apply absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl;
}

.btn-nav {
  @apply absolute top-1/2 transform -translate-y-1/2 text-white text-3xl p-2 bg-black bg-opacity-40 rounded-full hover:bg-opacity-60 transition;
}

.btn-nav.left {
  @apply left-3;
}

.btn-nav.right {
  @apply right-3;
}

.legenda-modal {
  @apply text-center mt-4 text-gray-600;
}

.rodape {
  @apply text-center text-sm text-gray-400 mt-10;
}

  `]
})
export class TelaFotosComponent implements OnInit {
  fotos: {url: string, nome: string, categoria?: string}[] = [];
  fotosFiltradas: {url: string, nome: string, categoria?: string}[] = [];
  carregando = true;
  modalAberto = false;
  indiceAtual = 0;
  categoriaAtiva = 'todas';

  categorias = [
    { valor: 'todas', label: 'Todas' },
    { valor: 'ambiente', label: 'Ambiente' },
    { valor: 'decoracao', label: 'Decoração' },
    { valor: 'eventos', label: 'Eventos' },
    { valor: 'detalhes', label: 'Detalhes' }
  ];

  constructor(private fotosService: FotosService) {}

  async ngOnInit() {
    await this.carregarFotos();
  }

  async carregarFotos() {
    this.carregando = true;
    try {
      this.fotos = [
        { url: 'assets/images/foto-salao-decorado.jpg', nome: 'Salão Decorado', categoria: 'ambiente' },
        { url: 'assets/images/foto-salao-dupla-mesas-brinquedos.jpg', nome: 'Salão com Mesas e Brinquedos', categoria: 'ambiente' },
        { url: 'assets/images/foto-salao-sacada.jpg', nome: 'Vista da Sacada', categoria: 'ambiente' },
        { url: 'assets/images/foto-mesa-decorado.jpg', nome: 'Mesa Decorada', categoria: 'decoracao' },
        { url: 'assets/images/foto-churrasqueira-refrigerador.jpg', nome: 'Área da Churrasqueira', categoria: 'ambiente' },
        { url: 'assets/images/foto-churrasqueira-dupla.jpg', nome: 'Churrasqueira Dupla', categoria: 'detalhes' },
        { url: 'assets/images/foto-brinquedos-dupla.jpg', nome: 'Brinquedos Infantis', categoria: 'eventos' },

      ];
      this.fotosFiltradas = [...this.fotos];
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    } finally {
      this.carregando = false;
    }
  }

  filtrarPorCategoria(categoria: string) {
    this.categoriaAtiva = categoria;
    this.fotosFiltradas = categoria === 'todas' 
      ? [...this.fotos] 
      : this.fotos.filter(foto => foto.categoria === categoria);
  }

  abrirModal(indice: number) {
    this.indiceAtual = indice;
    this.modalAberto = true;
    document.body.style.overflow = 'hidden';
  }

  fecharModal() {
    this.modalAberto = false;
    document.body.style.overflow = 'auto';
  }

  navegarFoto(direcao: number) {
    const novoIndice = this.indiceAtual + direcao;
    if (novoIndice >= 0 && novoIndice < this.fotosFiltradas.length) {
      this.indiceAtual = novoIndice;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscPress(event: KeyboardEvent) {
    if (this.modalAberto) {
      this.fecharModal();
    }
  }
}
