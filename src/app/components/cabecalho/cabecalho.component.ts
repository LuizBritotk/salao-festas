import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-cabecalho',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-lg sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-gradient-to-br from-dourado-400 to-dourado-600 rounded-lg flex items-center justify-center">
                <i class="pi pi-sparkle text-white text-xl"></i>
              </div>
              <span class="text-2xl font-bold bg-gradient-to-r from-dourado-600 to-azul-600 bg-clip-text text-transparent">
                Salão Imperial
              </span>
            </a>
          </div>

          <!-- Menu Desktop -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <a routerLink="/" 
                 routerLinkActive="text-dourado-600 border-b-2 border-dourado-600"
                 [routerLinkActiveOptions]="{exact: true}"
                 class="text-gray-700 hover:text-dourado-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Início
              </a>
              <a routerLink="/fotos" 
                 routerLinkActive="text-dourado-600 border-b-2 border-dourado-600"
                 class="text-gray-700 hover:text-dourado-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Galeria
              </a>
              <a routerLink="/calendario" 
                 routerLinkActive="text-dourado-600 border-b-2 border-dourado-600"
                 class="text-gray-700 hover:text-dourado-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Disponibilidade
              </a>
              <a routerLink="/parcerias" 
                 routerLinkActive="text-dourado-600 border-b-2 border-dourado-600"
                 class="text-gray-700 hover:text-dourado-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Parcerias
              </a>
              <a routerLink="/contato" 
                 routerLinkActive="text-dourado-600 border-b-2 border-dourado-600"
                 class="text-gray-700 hover:text-dourado-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Contato
              </a>
            </div>
          </div>

          <!-- Botões de ação -->
          <div class="hidden md:flex items-center space-x-4">
            <div *ngIf="!usuarioLogado; else usuarioMenu">
              <button (click)="abrirModalLogin()" 
                      class="text-azul-600 hover:text-azul-700 font-medium transition-colors duration-200">
                Entrar
              </button>
              <a routerLink="/agendamento" 
                 class="btn-primary ml-4">
                Fazer Reserva
              </a>
            </div>
            <ng-template #usuarioMenu>
              <div class="relative" (click)="toggleMenuUsuario()">
                <button class="flex items-center space-x-2 text-gray-700 hover:text-dourado-600 transition-colors duration-200">
                  <div class="w-8 h-8 bg-dourado-100 rounded-full flex items-center justify-center">
                    <i class="pi pi-user text-dourado-600"></i>
                  </div>
                  <span class="text-sm font-medium">{{ usuarioLogado?.displayName || 'Usuário' }}</span>
                  <i class="pi pi-chevron-down text-xs"></i>
                </button>
                
                <div *ngIf="menuUsuarioAberto" 
                     class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <a routerLink="/minhas-reservas" 
                     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Minhas Reservas
                  </a>
                  <a routerLink="/perfil" 
                     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Meu Perfil
                  </a>
                  <hr class="my-1">
                  <button (click)="sair()" 
                          class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Sair
                  </button>
                </div>
              </div>
            </ng-template>
          </div>

          <!-- Menu Mobile -->
          <div class="md:hidden">
            <button (click)="toggleMenuMobile()" 
                    class="text-gray-700 hover:text-dourado-600 focus:outline-none">
              <i class="pi pi-bars text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Menu Mobile Expandido -->
        <div *ngIf="menuMobileAberto" 
             class="md:hidden bg-white border-t border-gray-200 py-4">
          <div class="flex flex-col space-y-2">
            <a routerLink="/" 
               (click)="fecharMenuMobile()"
               class="block px-3 py-2 text-gray-700 hover:text-dourado-600 font-medium">
              Início
            </a>
            <a routerLink="/fotos" 
               (click)="fecharMenuMobile()"
               class="block px-3 py-2 text-gray-700 hover:text-dourado-600 font-medium">
              Galeria
            </a>
            <a routerLink="/calendario" 
               (click)="fecharMenuMobile()"
               class="block px-3 py-2 text-gray-700 hover:text-dourado-600 font-medium">
              Disponibilidade
            </a>
            <a routerLink="/parcerias" 
               (click)="fecharMenuMobile()"
               class="block px-3 py-2 text-gray-700 hover:text-dourado-600 font-medium">
              Parcerias
            </a>
            <a routerLink="/contato" 
               (click)="fecharMenuMobile()"
               class="block px-3 py-2 text-gray-700 hover:text-dourado-600 font-medium">
              Contato
            </a>
            
            <hr class="my-2">
            
            <div *ngIf="!usuarioLogado; else menuMobileUsuario">
              <button (click)="abrirModalLogin(); fecharMenuMobile()" 
                      class="block w-full text-left px-3 py-2 text-azul-600 font-medium">
                Entrar
              </button>
              <a routerLink="/agendamento" 
                 (click)="fecharMenuMobile()"
                 class="block px-3 py-2 text-center bg-dourado-500 text-white font-medium rounded-lg mt-2">
                Fazer Reserva
              </a>
            </div>
            <ng-template #menuMobileUsuario>
              <div class="px-3 py-2 text-sm text-gray-600">
                Olá, {{ usuarioLogado?.displayName || 'Usuário' }}
              </div>
              <a routerLink="/minhas-reservas" 
                 (click)="fecharMenuMobile()"
                 class="block px-3 py-2 text-gray-700 hover:text-dourado-600">
                Minhas Reservas
              </a>
              <a routerLink="/perfil" 
                 (click)="fecharMenuMobile()"
                 class="block px-3 py-2 text-gray-700 hover:text-dourado-600">
                Meu Perfil
              </a>
              <button (click)="sair(); fecharMenuMobile()" 
                      class="block w-full text-left px-3 py-2 text-red-600">
                Sair
              </button>
            </ng-template>
          </div>
        </div>
      </nav>
    </header>
  `
})
export class CabecalhoComponent implements OnInit {
  usuarioLogado: User | null = null;
  menuMobileAberto = false;
  menuUsuarioAberto = false;

  constructor(
    private autenticacao: AutenticacaoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.autenticacao.usuarioAtual$.subscribe(usuario => {
      this.usuarioLogado = usuario;
    });
  }

  toggleMenuMobile() {
    this.menuMobileAberto = !this.menuMobileAberto;
    this.menuUsuarioAberto = false;
  }

  toggleMenuUsuario() {
    this.menuUsuarioAberto = !this.menuUsuarioAberto;
    this.menuMobileAberto = false;
  }

  fecharMenuMobile() {
    this.menuMobileAberto = false;
  }

  abrirModalLogin() {
    this.router.navigate(['/login']);
  }

  async sair() {
    try {
      await this.autenticacao.sair();
      this.menuUsuarioAberto = false;
      this.menuMobileAberto = false;
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  }
}