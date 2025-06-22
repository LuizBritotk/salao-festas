import { Injectable } from '@angular/core';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy
} from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Parceiro, CategoriaParceiro } from '../interfaces/parceiro.interface';

@Injectable({
  providedIn: 'root'
})
export class ParceirosService {
  private readonly colecaoParceiros = 'parceiros';

  constructor(private firebase: FirebaseService) {}

  obterTodosParceiros(): Observable<Parceiro[]> {
    const consulta = query(
      collection(this.firebase.firestore, this.colecaoParceiros),
      where('ativo', '==', true),
      orderBy('nome')
    );

    return from(getDocs(consulta)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Parceiro))
      )
    );
  }

  obterParceirosPorCategoria(categoria: CategoriaParceiro): Observable<Parceiro[]> {
    const consulta = query(
      collection(this.firebase.firestore, this.colecaoParceiros),
      where('categoria', '==', categoria),
      where('ativo', '==', true),
      orderBy('nome')
    );

    return from(getDocs(consulta)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Parceiro))
      )
    );
  }

  async obterParceiro(id: string): Promise<Parceiro | null> {
    try {
      const docSnap = await getDoc(doc(this.firebase.firestore, this.colecaoParceiros, id));
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Parceiro;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao obter parceiro:', error);
      throw error;
    }
  }

  obterCategoriasParceiros(): { valor: CategoriaParceiro, label: string }[] {
    return [
      { valor: CategoriaParceiro.BUFFET, label: 'Buffet' },
      { valor: CategoriaParceiro.DECORACAO, label: 'Decoração' },
      { valor: CategoriaParceiro.FOTOGRAFIA, label: 'Fotografia' },
      { valor: CategoriaParceiro.MUSICA_DJ, label: 'Música/DJ' },
      { valor: CategoriaParceiro.FLORICULTURA, label: 'Floricultura' },
      { valor: CategoriaParceiro.DOCES_BOLOS, label: 'Doces e Bolos' },
      { valor: CategoriaParceiro.SEGURANCA, label: 'Segurança' },
      { valor: CategoriaParceiro.LIMPEZA, label: 'Limpeza' },
      { valor: CategoriaParceiro.TRANSPORTE, label: 'Transporte' },
      { valor: CategoriaParceiro.OUTROS, label: 'Outros' }
    ];
  }
}