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
import { Reserva, StatusReserva, DisponibilidadeData } from '../interfaces/reserva.interface';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private readonly colecaoReservas = 'reservas';

  constructor(private firebase: FirebaseService) {}

  async criarReserva(reserva: Omit<Reserva, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(this.firebase.firestore, this.colecaoReservas), 
        {
          ...reserva,
          dataCriacao: Timestamp.fromDate(reserva.dataCriacao),
          dataUltimaAtualizacao: Timestamp.fromDate(reserva.dataUltimaAtualizacao),
          dataEvento: Timestamp.fromDate(reserva.dataEvento)
        }
      );
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      throw error;
    }
  }

  async atualizarReserva(id: string, dadosAtualizacao: Partial<Reserva>): Promise<void> {
    try {
      const dadosParaAtualizar = {
        ...dadosAtualizacao,
        dataUltimaAtualizacao: Timestamp.fromDate(new Date())
      };

      if (dadosAtualizacao.dataEvento) {
        dadosParaAtualizar.dataEvento = Timestamp.fromDate(dadosAtualizacao.dataEvento);
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
      
      if (docSnap.exists()) {
        const dados = docSnap.data();
        return {
          id: docSnap.id,
          ...dados,
          dataCriacao: dados.dataCriacao.toDate(),
          dataUltimaAtualizacao: dados.dataUltimaAtualizacao.toDate(),
          dataEvento: dados.dataEvento.toDate()
        } as Reserva;
      }
      
      return null;
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
            dataCriacao: dados.dataCriacao.toDate(),
            dataUltimaAtualizacao: dados.dataUltimaAtualizacao.toDate(),
            dataEvento: dados.dataEvento.toDate()
          } as Reserva;
        })
      )
    );
  }

  async obterDisponibilidadeMes(ano: number, mes: number): Promise<DisponibilidadeData[]> {
    try {
      const inicioMes = new Date(ano, mes, 1);
      const fimMes = new Date(ano, mes + 1, 0);

      const consulta = query(
        collection(this.firebase.firestore, this.colecaoReservas),
        where('dataEvento', '>=', Timestamp.fromDate(inicioMes)),
        where('dataEvento', '<=', Timestamp.fromDate(fimMes)),
        where('status', 'in', [StatusReserva.CONFIRMADA, StatusReserva.PENDENTE])
      );

      const snapshot = await getDocs(consulta);
      const reservasExistentes = snapshot.docs.map(doc => {
        const dados = doc.data();
        return {
          id: doc.id,
          ...dados,
          dataCriacao: dados.dataCriacao.toDate(),
          dataUltimaAtualizacao: dados.dataUltimaAtualizacao.toDate(),
          dataEvento: dados.dataEvento.toDate()
        } as Reserva;
      });

      // Gerar disponibilidade para cada dia do mês
      const disponibilidade: DisponibilidadeData[] = [];
      const diasNoMes = fimMes.getDate();

      for (let dia = 1; dia <= diasNoMes; dia++) {
        const data = new Date(ano, mes, dia);
        const reservasNoDia = reservasExistentes.filter(
          reserva => this.isMesmaData(reserva.dataEvento, data)
        );

        const horariosOcupados = reservasNoDia.map(reserva => ({
          inicio: reserva.horaInicio,
          fim: reserva.horaFim
        }));

        const horariosDisponiveis = this.calcularHorariosDisponiveis(horariosOcupados);

        disponibilidade.push({
          data,
          disponivel: horariosDisponiveis.length > 0,
          horariosDisponiveis,
          reservas: reservasNoDia
        });
      }

      return disponibilidade;
    } catch (error) {
      console.error('Erro ao obter disponibilidade:', error);
      throw error;
    }
  }

  private isMesmaData(data1: Date, data2: Date): boolean {
    return data1.getDate() === data2.getDate() &&
           data1.getMonth() === data2.getMonth() &&
           data1.getFullYear() === data2.getFullYear();
  }

  private calcularHorariosDisponiveis(horariosOcupados: {inicio: string, fim: string}[]): string[] {
    const todosHorarios = [
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
      '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
      '20:00', '21:00', '22:00', '23:00'
    ];

    return todosHorarios.filter(horario => {
      return !horariosOcupados.some(ocupado => {
        const horarioNum = parseInt(horario.replace(':', ''));
        const inicioNum = parseInt(ocupado.inicio.replace(':', ''));
        const fimNum = parseInt(ocupado.fim.replace(':', ''));
        
        return horarioNum >= inicioNum && horarioNum < fimNum;
      });
    });
  }

  async verificarDisponibilidade(data: Date, horaInicio: string, horaFim: string): Promise<boolean> {
    try {
      const consulta = query(
        collection(this.firebase.firestore, this.colecaoReservas),
        where('dataEvento', '==', Timestamp.fromDate(data)),
        where('status', 'in', [StatusReserva.CONFIRMADA, StatusReserva.PENDENTE])
      );

      const snapshot = await getDocs(consulta);
      const reservasExistentes = snapshot.docs.map(doc => doc.data() as Reserva);

      // Verificar se há conflito de horário
      const horaInicioNum = parseInt(horaInicio.replace(':', ''));
      const horaFimNum = parseInt(horaFim.replace(':', ''));

      return !reservasExistentes.some(reserva => {
        const reservaInicioNum = parseInt(reserva.horaInicio.replace(':', ''));
        const reservaFimNum = parseInt(reserva.horaFim.replace(':', ''));

        return (horaInicioNum < reservaFimNum && horaFimNum > reservaInicioNum);
      });
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      return false;
    }
  }
}