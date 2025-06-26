import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { ReservasService } from '../../services/reservas.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tela-agendamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FullCalendarModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

  <!-- Botão Voltar -->
  <div class="mb-6">
    <button type="button" (click)="voltar()" class="flex items-center text-gray-600 hover:text-dourado-600 font-medium">
      <i class="pi pi-arrow-left mr-2"></i>
      Voltar
    </button>
  </div>

  <!-- Título -->
  <div class="text-center mb-10">
    <h1 class="text-4xl font-bold text-gray-900">
      Agende sua <span class="text-dourado-600">Festa</span>
    </h1>
    <p class="text-gray-600 max-w-2xl mx-auto mt-4">
      Consulte a disponibilidade e envie sua solicitação de reserva.
    </p>
  </div>

  <!-- Formulário -->
  <div class="bg-white rounded-xl shadow p-8 max-w-3xl mx-auto">
    <form [formGroup]="formulario" (ngSubmit)="agendar()">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <!-- Nome -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input type="text" formControlName="nome" class="form-input" placeholder="Nome completo" />
          <div *ngIf="formulario.get('nome')?.invalid && formulario.get('nome')?.touched" class="text-red-500 text-sm mt-1">
            Nome é obrigatório
          </div>
        </div>

        <!-- Telefone -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
          <input type="tel" formControlName="telefone" mask="(00) 00000-0000" class="form-input" placeholder="(11) 99999-9999" />
          <div *ngIf="formulario.get('telefone')?.invalid && formulario.get('telefone')?.touched" class="text-red-500 text-sm mt-1">
            Telefone é obrigatório
          </div>
        </div>

        <!-- Data + Horário -->
        <div class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data *</label>
            <div class="flex gap-1 items-center">
              <input type="text" formControlName="data" class="form-input" readonly placeholder="Clique no calendário" />
              <button type="button" class="btn-primary px-4 py-2 text-sm" (click)="abrirCalendario()">📅</button>
            </div>
            <div *ngIf="formulario.get('data')?.invalid && formulario.get('data')?.touched" class="text-red-500 text-sm mt-1">
              Data é obrigatória
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Horário *</label>
            <input type="time" formControlName="horario" class="form-input" />
            <div *ngIf="formulario.get('horario')?.invalid && formulario.get('horario')?.touched" class="text-red-500 text-sm mt-1">
              Horário é obrigatório
            </div>
          </div>
        </div>

        <!-- Tipo de Evento -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Evento *</label>
          <select formControlName="tipoEvento" class="form-input">
            <option value="">Selecione</option>
            <option value="aniversario">Aniversário</option>
            <option value="confraternizacao">Confraternização</option>
            <option value="batizado">Batizado</option>
            <option value="casamento">Casamento</option>
            <option value="outro">Outro</option>
          </select>
          <div *ngIf="formulario.get('tipoEvento')?.invalid && formulario.get('tipoEvento')?.touched" class="text-red-500 text-sm mt-1">
            Tipo é obrigatório
          </div>
        </div>

        <!-- Observações -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
          <textarea rows="4" formControlName="observacoes" class="form-input resize-none" placeholder="Ex: Festa com DJ, necessidade de rampa..."></textarea>
        </div>
      </div>

      <!-- Botão Enviar -->
      <button type="submit" [disabled]="formulario.invalid || enviando"
        class="btn-primary w-full mt-6 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
        <div *ngIf="enviando" class="spinner mr-2 w-4 h-4"></div>
        <i *ngIf="!enviando" class="pi pi-calendar-plus mr-2"></i>
        {{ enviando ? 'Enviando...' : 'Solicitar Agendamento' }}
      </button>
    </form>

    <!-- Feedback -->
    <div *ngIf="sucesso" class="text-green-700 bg-green-100 p-4 mt-4 rounded-lg">
      Solicitação enviada com sucesso!
    </div>

    <div *ngIf="erro" class="text-red-700 bg-red-100 p-4 mt-4 rounded-lg">
      Ocorreu um erro ao enviar. Tente novamente.
    </div>
  </div>

  <!-- Modal Calendário -->
  <div *ngIf="mostrarModalCalendario" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full relative">
      <button (click)="fecharModalCalendario()" class="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg font-bold">
        &times;
      </button>

      <h2 class="text-xl font-semibold mb-4 text-center text-gray-700">Escolha uma Data</h2>

      <div class="flex flex-col lg:flex-row gap-6">
        <div class="flex-1">
          <ng-container *ngIf="calendario">
            <full-calendar #calendarioRef [options]="calendario"></full-calendar>
          </ng-container>
        </div>
        <div class="w-full lg:w-56 bg-gray-50 p-4 rounded-lg border border-gray-200 h-fit self-start">
          <h2 class="text-sm font-semibold text-gray-700 mb-3">Legenda</h2>
          <ul class="space-y-2 text-sm">
            <li *ngFor="let item of legendaCores" class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full" [style.background]="item.cor"></span>
              {{ item.descricao }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Rodapé -->
  <footer class="text-center text-gray-500 text-sm mt-10">
    © 2018 Espaço Elias. Todos os direitos reservados.
  </footer>
</div>
  `,
  styles: [`.calendario-responsivo {
  @apply max-w-4xl mx-auto;
}

::ng-deep .fc {
  font-size: 0.85rem;
}

::ng-deep .fc-toolbar-title {
  font-size: 1.2rem;
}

@media (max-width: 640px) {
  ::ng-deep .fc-toolbar {
    flex-direction: column;
    gap: 0.5rem;
  }

  ::ng-deep .fc-daygrid-day-number {
    font-size: 0.7rem;
  }

  .calendario-responsivo {
    @apply px-2 py-2;
  }
}

.form-input {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dourado-500 focus:border-transparent transition-all duration-200;
}

.btn-primary {
  @apply bg-dourado-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform duration-200;
}

.btn-primary:hover {
  @apply bg-dourado-600 transform scale-105;
}

.spinner {
  border: 4px solid #f3f4f6;
  border-top: 4px solid #f59e0b;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.modal-backdrop {
  @apply fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center;
}

.modal-conteudo {
  @apply bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full relative;
}

.modal-conteudo button.fechar {
  @apply absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg font-bold;
}

  `]
})
// TelaAgendamentoComponent
// Componente responsável por exibir a tela de agendamento de reservas
export class TelaAgendamentoComponent implements OnInit, AfterViewInit {
  @ViewChild('calendarioRef') calendarioRef?: FullCalendarComponent;
  @ViewChild('modalCalendario') modalCalendario?: any;

  formulario: FormGroup;
  calendario!: CalendarOptions;
  enviando = false;
  sucesso = false;
  erro = false;
  mostrarModalCalendario = false;
  pinEnviado = false;
  numeroVerificado = false;
  codigoEnviado = '';
  codigoDigitado = '';
  erroPIN = false;

  legendaCores = [
    { cor: '#10B981', descricao: 'Dia Livre' },
    { cor: '#EF4444', descricao: 'Reservado' },
    { cor: '#F59E0B', descricao: 'Com Interesse' }
  ];

  constructor(
    private fb: FormBuilder,
    private reservasService: ReservasService,
    private router: Router
  ) {
    // Criação do formulário reativo com validações iniciais
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', [Validators.required]],
      data: ['', [Validators.required, this.validarDataFutura]],
      horario: ['', Validators.required],
      tipoEvento: ['', Validators.required],
      observacoes: ['']
    });
  }

  /*
   * Método executado na inicialização do componente
   * Configura o calendário com os eventos retornados do serviço
   */
  ngOnInit(): void {
    this.reservasService.obterDatasAgendadas().subscribe(eventos => {
      this.calendario = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: eventos,
        locale: 'pt-br',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: ''
        },
        eventClick: (info) => {
          alert(`Data já reservada: ${info.event.start?.toLocaleDateString()}`);
        },
        dayCellDidMount: (arg) => {
          const dataStr = arg.date.toISOString().split('T')[0];
          const evento = eventos.find(e => new Date(e.start).toISOString().includes(dataStr));
          if (evento && evento.color) {
            (arg.el as HTMLElement).style.backgroundColor = evento.color;
          }
        },
        dateClick: (info) => {
          const data = new Date(info.date);
          const dia = data.getDate().toString().padStart(2, '0');
          const mes = (data.getMonth() + 1).toString().padStart(2, '0');
          const ano = data.getFullYear();
          const dataFormatada = `${dia}/${mes}/${ano}`;

          this.formulario.patchValue({ data: dataFormatada });
          this.mostrarModalCalendario = false;
        }
      };
    });
  }

  /*
   * Após a visualização ser carregada, posiciona o calendário na data atual
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.calendarioRef) {
        const calendarApi = this.calendarioRef.getApi();
        calendarApi.gotoDate(new Date());
      }
    });
  }

  // Abre o modal de calendário
  abrirCalendario(): void {
    this.mostrarModalCalendario = true;
  }

  // Fecha o modal de calendário
  fecharModalCalendario(): void {
    this.mostrarModalCalendario = false;
  }

  /*
   * Método responsável por enviar a solicitação de agendamento
   * Chama o serviço, mostra mensagens de sucesso/erro, e redireciona
   */
  async agendar() {
    if (this.formulario.valid && this.numeroVerificado) {
      try {
        this.enviando = true;
        this.erro = false;

        await this.reservasService.solicitarAgendamento(this.formulario.value);

        this.sucesso = true;
        console.log('✔ Sucesso! Redirecionando para pagamento...');
        this.limparCamposFormulario();
        setTimeout(() => this.router.navigate(['/pagamento']), 3000);

      } catch (e: any) {
        this.erro = true;
        console.error('❌ Erro ao agendar:', e.message || e);
      } finally {
        this.enviando = false;
      }
    }
  }

  /*
   * Método que limpa todos os campos do formulário manualmente,
   * além de resetar o estado de toque e alteração
   */
  private limparCamposFormulario(): void {
    this.formulario.patchValue({
      nome: '',
      telefone: '',
      data: '',
      horario: '',
      tipoEvento: '',
      observacoes: ''
    });

    this.formulario.markAsPristine();
    this.formulario.markAsUntouched();
    this.numeroVerificado = false;
    this.pinEnviado = false;
    this.codigoDigitado = '';
    this.codigoEnviado = '';
    this.erroPIN = false;
  }

  /*
   * Validador customizado que impede selecionar datas passadas
   */
  private validarDataFutura(control: any) {
    const partes = control.value.split('/');
    if (partes.length !== 3) return { dataInvalida: true };
    const data = new Date(+partes[2], +partes[1] - 1, +partes[0]);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return data >= hoje ? null : { dataInvalida: true };
  }

  /*
  * Método para voltar à tela anterior
  * Utiliza o router para navegar de volta  
  * Se não houver histórico, redireciona para a página inicial  
  */
 voltar(): void {
  this.router.navigate(['/']); // ou para a rota que desejar
}
}

