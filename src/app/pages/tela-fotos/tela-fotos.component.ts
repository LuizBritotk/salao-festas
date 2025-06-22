import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FotosService } from '../../services/fotos.service';

@Component({
  selector: 'app-tela-fotos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <!-- Header da Galeria -->
      <div class="header">
        <div class="header-content">
          <h1 class="title">
            Galeria do 
            <span class="highlight">Salão Imperial</span>
          </h1>
          <p class="subtitle">
            Conheça nossos espaços elegantes e veja como suas celebrações 
            podem ficar ainda mais especiais em nosso ambiente.
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="carregando" class="loading">
        <div class="spinner"></div>
      </div>

      <!-- Galeria de Fotos -->
      <div *ngIf="!carregando" class="gallery">
        <!-- Filtros de Categoria -->
        <div class="filters">
          <button 
            *ngFor="let categoria of categorias"
            (click)="filtrarPorCategoria(categoria.valor)"
            [class.active]="categoriaAtiva === categoria.valor"
            [attr.aria-pressed]="categoriaAtiva === categoria.valor">
            {{ categoria.label }}
          </button>
        </div>

        <!-- Grid de Fotos -->
        <div *ngIf="fotosFiltradas.length > 0" class="grid">
          <div 
            *ngFor="let foto of fotosFiltradas; let i = index"
            class="photo-card"
            (click)="abrirModal(i)"
            tabindex="0"
            (keydown.enter)="abrirModal(i)"
            (keydown.space)="abrirModal(i)"
            role="button"
            [attr.aria-label]="'Abrir foto ' + foto.nome">
            <img 
              [src]="foto.url" 
              [alt]="foto.nome"
              loading="lazy"
            >
            <div class="overlay">
              <i class="pi pi-search-plus"></i>
            </div>
          </div>
        </div>

        <!-- Mensagem quando não há fotos -->
        <div *ngIf="fotosFiltradas.length === 0 && !carregando" 
             class="no-photos"
             role="alert" aria-live="polite">
          <i class="pi pi-images"></i>
          <h3>Nenhuma foto encontrada</h3>
          <p>Não encontramos fotos para esta categoria no momento.</p>
        </div>
      </div>

      <!-- Modal de Visualização -->
      <div *ngIf="modalAberto" 
           class="modal-backdrop"
           (click)="fecharModal()"
           role="dialog"
           aria-modal="true"
           aria-label="Visualização da foto ampliada">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button 
            (click)="fecharModal()"
            class="btn-close"
            aria-label="Fechar visualização da foto">
            <i class="pi pi-times"></i>
          </button>

          <button 
            *ngIf="indiceAtual > 0"
            (click)="navegarFoto(-1); $event.stopPropagation()"
            class="btn-prev"
            aria-label="Foto anterior">
            <i class="pi pi-chevron-left"></i>
          </button>

          <button 
            *ngIf="indiceAtual < fotosFiltradas.length - 1"
            (click)="navegarFoto(1); $event.stopPropagation()"
            class="btn-next"
            aria-label="Próxima foto">
            <i class="pi pi-chevron-right"></i>
          </button>

          <img 
            [src]="fotosFiltradas[indiceAtual].url" 
            [alt]="fotosFiltradas[indiceAtual].nome"
            class="modal-image"
          >

          <div class="photo-info">
            <h3>{{ fotosFiltradas[indiceAtual].nome }}</h3>
            <p>{{ indiceAtual + 1 }} de {{ fotosFiltradas.length }}</p>
          </div>
        </div>
      </div>
    </div>
  `
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
        { url: 'assets/images/hue.png', nome: 'Iluminação Ambiente', categoria: 'detalhes' },
        { url: 'assets/images/color.png', nome: 'Cores da Decoração', categoria: 'decoracao' }
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
