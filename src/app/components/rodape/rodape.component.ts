import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-rodape',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Logo e Descrição -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-dourado-400 to-dourado-600 rounded-lg flex items-center justify-center">
                <i class="pi pi-sparkle text-white text-xl"></i>
              </div>
              <span class="text-2xl font-bold">Salão Imperial</span>
            </div>
            <p class="text-gray-300 mb-4">
              O espaço perfeito para suas celebrações especiais. 
              Com ambiente elegante e serviços de qualidade, 
              transformamos seus momentos em memórias inesquecíveis.
            </p>
            <div class="flex space-x-4">
              <a href="https://facebook.com" target="_blank" 
                 class="text-gray-400 hover:text-dourado-400 transition-colors duration-200">
                <i class="pi pi-facebook text-xl"></i>
              </a>
              <a href="https://instagram.com" target="_blank" 
                 class="text-gray-400 hover:text-dourado-400 transition-colors duration-200">
                <i class="pi pi-instagram text-xl"></i>
              </a>
              <a href="https://whatsapp.com" target="_blank" 
                 class="text-gray-400 hover:text-dourado-400 transition-colors duration-200">
                <i class="pi pi-whatsapp text-xl"></i>
              </a>
            </div>
          </div>

          <!-- Links Rápidos -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul class="space-y-2">
              <li>
                <a routerLink="/" class="text-gray-300 hover:text-dourado-400 transition-colors duration-200">
                  Início
                </a>
              </li>
              <li>
                <a routerLink="/fotos" class="text-gray-300 hover:text-dourado-400 transition-colors duration-200">
                  Galeria de Fotos
                </a>
              </li>
              <li>
                <a routerLink="/calendario" class="text-gray-300 hover:text-dourado-400 transition-colors duration-200">
                  Disponibilidade
                </a>
              </li>
              <li>
                <a routerLink="/parcerias" class="text-gray-300 hover:text-dourado-400 transition-colors duration-200">
                  Parcerias
                </a>
              </li>
              <li>
                <a routerLink="/contato" class="text-gray-300 hover:text-dourado-400 transition-colors duration-200">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <!-- Contato -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Contato</h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-2">
                <i class="pi pi-map-marker text-dourado-400"></i>
                <span class="text-gray-300 text-sm">
                  Rua das Festas, 123<br>
                  Centro - São Paulo/SP
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <i class="pi pi-phone text-dourado-400"></i>
                <span class="text-gray-300 text-sm">(11) 99999-9999</span>
              </div>
              <div class="flex items-center space-x-2">
                <i class="pi pi-envelope text-dourado-400"></i>
                <span class="text-gray-300 text-sm">contato&#64;salao-imperial.com.br</span>
              </div>
              <div class="flex items-center space-x-2">
                <i class="pi pi-clock text-dourado-400"></i>
                <span class="text-gray-300 text-sm">
                  Seg-Sáb: 8h às 18h<br>
                  Dom: 8h às 16h
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Linha divisória -->
        <hr class="border-gray-700 my-8">

        <!-- Rodapé inferior -->
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-gray-400 text-sm mb-4 md:mb-0">
            © {{ anoAtual }} Salão Imperial. Todos os direitos reservados.
          </div>
          <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
            <a routerLink="/privacidade" class="hover:text-dourado-400 transition-colors duration-200">
              Política de Privacidade
            </a>
            <a routerLink="/termos" class="hover:text-dourado-400 transition-colors duration-200">
              Termos de Uso
            </a>
            <a routerLink="/lgpd" class="hover:text-dourado-400 transition-colors duration-200">
              LGPD
            </a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class RodapeComponent {
  anoAtual = new Date().getFullYear();
}