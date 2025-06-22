import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebase);
  public auth = getAuth(this.app);
  public firestore = getFirestore(this.app);
  public storage = getStorage(this.app);
  public functions = getFunctions(this.app, 'southamerica-east1'); // Região do Brasil

  constructor() {
    // Configurar idioma para português
    this.auth.languageCode = 'pt-BR';
  }
}