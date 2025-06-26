import { Routes } from '@angular/router';
import { TelaInicialComponent } from './pages/tela-inicial/tela-inicial.component';
import { TelaContatoComponent } from './pages/tela-contato/tela-contato.component';
import { TelaFotosComponent } from './pages/tela-fotos/tela-fotos.component';
import { TelaAgendamentoComponent } from './pages/tela-agendamento/tela-agendamento.component';
import { TelaPagamentoComponent } from './pages/tela-pagamento/tela-pagamento.component';

export const routes: Routes = [
  { path: '', component: TelaInicialComponent },
  { path: 'contato', component: TelaContatoComponent },
  { path: 'fotos', component: TelaFotosComponent },
  { path: 'agendamento', component: TelaAgendamentoComponent },
  { path: 'pagamento', component: TelaPagamentoComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
