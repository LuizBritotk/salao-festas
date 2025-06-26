import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Reserva, StatusReserva, DisponibilidadeData, StatusPagamento } from '../interfaces/reserva.interface';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private readonly colecaoReservas = 'reservas';

  constructor(private firebase: FirebaseService) {}

  async solicitarAgendamento(dados: any): Promise<void> {
    try {
      debugger;

      let dataEvento: Date;
      let nomeContato: string = dados.nome || '';
      let telefoneContato: string = dados.telefone || '';
      let horario: string = dados.horario || '';
      let tipoEvento: string = dados.tipoEvento || '';
      let observacoes: string = dados.observacoes || '';

      try {
        const partes = dados.data?.split('/');
        if (!partes || partes.length !== 3) {
          throw new Error('Data em formato inválido');
        }
        const [dia, mes, ano] = partes;
        dataEvento = new Date(`${ano}-${mes}-${dia}`);
        if (isNaN(dataEvento.getTime())) {
          throw new Error('Data inválida');
        }
      } catch (erro) {
        console.error('❌ Erro ao converter data:', erro);
        throw new Error('Data de agendamento inválida.');
      }

      const reserva: Omit<Reserva, 'id'> = {
        usuarioId: '',
        nomeContato,
        emailContato: '',
        telefoneContato,
        dataEvento,
        horaInicio: horario,
        horaFim: this.calcularFim(horario),
        tipoEvento,
        numeroConvidados: 0,
        valorTotal: 0,
        observacoes,
        servicosExtras: [],
        status: StatusReserva.PENDENTE,
        dataCriacao: new Date(),
        dataUltimaAtualizacao: new Date(),
        pagamento: {
          status: StatusPagamento.PENDENTE,
          metodoPagamento: 'pendente'
        }
      };

      await this.criarReserva(reserva);
    } catch (error) {
      console.error('Erro ao solicitar agendamento:', error);
      throw error;
    }
  }

  private calcularFim(hora: string): string {
    const [h, m] = hora.split(':').map(Number);
    const novaHora = h + 4 >= 23 ? 23 : h + 4;
    return `${novaHora.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  obterDatasAgendadas(): Observable<{ title: string; start: Date; color: string }[]> {
    const consulta = query(
      collection(this.firebase.firestore, this.colecaoReservas),
      where('status', 'in', [StatusReserva.CONFIRMADA, StatusReserva.PENDENTE])
    );

    return from(getDocs(consulta)).pipe(
      map(snapshot => snapshot.docs.map(doc => {
        const dados = doc.data();
        const status = dados['status'];
        const cor = status === StatusReserva.CONFIRMADA ? '#EF4444' : '#F59E0B';

        return {
          title: 'Reservado',
          start: dados['dataEvento'].toDate(),
          color: cor
        };
      }))
    );
  }

  async criarReserva(reserva: Omit<Reserva, 'id'>): Promise<string> {
    try {
      const payload: any = {
        ...reserva,
        dataCriacao: Timestamp.fromDate(reserva.dataCriacao),
        dataUltimaAtualizacao: Timestamp.fromDate(reserva.dataUltimaAtualizacao),
        dataEvento: Timestamp.fromDate(reserva.dataEvento)
      };

      if (reserva.pagamento?.dataPagamento) {
        payload.pagamento = {
          ...reserva.pagamento,
          dataPagamento: Timestamp.fromDate(reserva.pagamento.dataPagamento)
        };
      }

      const docRef = await addDoc(collection(this.firebase.firestore, this.colecaoReservas), payload);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      throw error;
    }
  }

  async atualizarReserva(id: string, dadosAtualizacao: Partial<Reserva>): Promise<void> {
    try {
      const dadosParaAtualizar: any = {
        ...dadosAtualizacao,
        dataUltimaAtualizacao: Timestamp.fromDate(new Date())
      };

      if (dadosAtualizacao.dataEvento) {
        dadosParaAtualizar.dataEvento = Timestamp.fromDate(dadosAtualizacao.dataEvento);
      }

      if (dadosAtualizacao.pagamento?.dataPagamento) {
        dadosParaAtualizar.pagamento = {
          ...dadosAtualizacao.pagamento,
          dataPagamento: Timestamp.fromDate(dadosAtualizacao.pagamento.dataPagamento)
        };
      }

      await updateDoc(doc(this.firebase.firestore, this.colecaoReservas, id), dadosParaAtualizar);
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      throw error;
    }
  }

  async excluirReserva(id: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firebase.firestore, this.colecaoReservas, id));
    } catch (error) {
      console.error('Erro ao excluir reserva:', error);
      throw error;
    }
  }

  async obterReserva(id: string): Promise<Reserva | null> {
    try {
      const docSnap = await getDoc(doc(this.firebase.firestore, this.colecaoReservas, id));
      if (!docSnap.exists()) return null;

      const dados = docSnap.data();
      return {
        id: docSnap.id,
        ...dados,
        dataCriacao: dados['dataCriacao'].toDate(),
        dataUltimaAtualizacao: dados['dataUltimaAtualizacao'].toDate(),
        dataEvento: dados['dataEvento'].toDate(),
        pagamento: dados['pagamento'] ? {
          ...dados['pagamento'],
          dataPagamento: dados['pagamento'].dataPagamento
            ? dados['pagamento'].dataPagamento.toDate()
            : undefined
        } : undefined
      } as Reserva;
    } catch (error) {
      console.error('Erro ao obter reserva:', error);
      throw error;
    }
  }

  obterReservasUsuario(usuarioId: string): Observable<Reserva[]> {
    const consulta = query(
      collection(this.firebase.firestore, this.colecaoReservas),
      where('usuarioId', '==', usuarioId),
      orderBy('dataCriacao', 'desc')
    );

    return from(getDocs(consulta)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => {
          const dados = doc.data();
          return {
            id: doc.id,
            ...dados,
            dataCriacao: dados['dataCriacao'].toDate(),
            dataUltimaAtualizacao: dados['dataUltimaAtualizacao'].toDate(),
            dataEvento: dados['dataEvento'].toDate(),
            pagamento: dados['pagamento'] ? {
              ...dados['pagamento'],
              dataPagamento: dados['pagamento'].dataPagamento
                ? dados['pagamento'].dataPagamento.toDate()
                : undefined
            } : undefined
          } as Reserva;
        })
      )
    );
  }

// abrirWhatsApp(telefone: string, codigo: string): void {
//   const numero = telefone.replace(/\D/g, ''); // remove não dígitos
//   const mensagem = encodeURIComponent(`Seu código de verificação é: ${codigo}`);
//   const url = `https://wa.me/55${numero}?text=${mensagem}`;
//   window.open(url, '_blank');
// }

// enviarSMS(telefone: string, codigo: string): void {
//   const numero = telefone.replace(/\D/g, '');
//   const mensagem = encodeURIComponent(`Seu código de verificação é: ${codigo}`);
//   const smsUrl = `sms:+55${numero}?body=${mensagem}`;
//   window.location.href = smsUrl;
// }
  async verificarDisponibilidade(data: Date, horaInicio: string, horaFim: string): Promise<boolean> {
    try {
      const consulta = query(
        collection(this.firebase.firestore, this.colecaoReservas),
        where('dataEvento', '==', Timestamp.fromDate(data)),
        where('status', 'in', [StatusReserva.CONFIRMADA, StatusReserva.PENDENTE])
      );

      const snapshot = await getDocs(consulta);
      const reservas = snapshot.docs.map(doc => doc.data() as Reserva);

      const inicio = parseInt(horaInicio.replace(':', ''));
      const fim = parseInt(horaFim.replace(':', ''));

      return !reservas.some(r => {
        const rInicio = parseInt(r.horaInicio.replace(':', ''));
        const rFim = parseInt(r.horaFim.replace(':', ''));
        return inicio < rFim && fim > rInicio;
      });
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      throw error;
    }
  }
}
