import { Injectable } from '@angular/core';
import { 
  ref, 
  listAll, 
  getDownloadURL,
  uploadBytes,
  deleteObject
} from 'firebase/storage';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class FotosService {
  private readonly pastaGaleria = 'galeria-salao';

  constructor(private firebase: FirebaseService) {}

  async obterFotosGaleria(): Promise<{url: string, nome: string}[]> {
    try {
      const galeriRef = ref(this.firebase.storage, this.pastaGaleria);
      const listaItens = await listAll(galeriRef);
      
      const urlsPromises = listaItens.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          url,
          nome: item.name
        };
      });

      return await Promise.all(urlsPromises);
    } catch (error) {
      console.error('Erro ao obter fotos da galeria:', error);
      return [];
    }
  }

  async uploadFotoGaleria(arquivo: File): Promise<string> {
    try {
      const nomeArquivo = `${Date.now()}_${arquivo.name}`;
      const storageRef = ref(this.firebase.storage, `${this.pastaGaleria}/${nomeArquivo}`);
      
      await uploadBytes(storageRef, arquivo);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      throw error;
    }
  }

  async excluirFotoGaleria(nomeArquivo: string): Promise<void> {
    try {
      const storageRef = ref(this.firebase.storage, `${this.pastaGaleria}/${nomeArquivo}`);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Erro ao excluir foto:', error);
      throw error;
    }
  }
}