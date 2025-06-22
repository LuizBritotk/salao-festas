import { Injectable } from '@angular/core';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { CriptografiaService } from './criptografia.service';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private usuarioAtualSubject = new BehaviorSubject<User | null>(null);
  public usuarioAtual$ = this.usuarioAtualSubject.asObservable();

  constructor(
    private firebase: FirebaseService,
    private criptografia: CriptografiaService
  ) {
    // Observar mudanças no estado de autenticação
    this.firebase.auth.onAuthStateChanged((usuario) => {
      this.usuarioAtualSubject.next(usuario);
      if (usuario) {
        this.atualizarUltimoLogin(usuario.uid);
      }
    });
  }

  async entrarComEmailSenha(email: string, senha: string): Promise<User> {
    const credencial = await signInWithEmailAndPassword(this.firebase.auth, email, senha);
    return credencial.user;
  }

  async criarContaComEmailSenha(dadosUsuario: {
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    consentimentoLGPD: boolean;
  }): Promise<User> {
    const credencial = await createUserWithEmailAndPassword(
      this.firebase.auth, 
      dadosUsuario.email, 
      dadosUsuario.senha
    );

    // Atualizar perfil do usuário
    await updateProfile(credencial.user, { displayName: dadosUsuario.nome });

    // Salvar dados do usuário no Firestore
    const usuario: Usuario = {
      id: credencial.user.uid,
      nome: dadosUsuario.nome,
      email: dadosUsuario.email,
      emailCriptografado: this.criptografia.criptografarDado(dadosUsuario.email),
      telefone: dadosUsuario.telefone,
      telefoneCriptografado: this.criptografia.criptografarDado(dadosUsuario.telefone),
      dataCriacao: new Date(),
      consentimentoLGPD: dadosUsuario.consentimentoLGPD,
      dataConsentimentoLGPD: new Date()
    };

    await setDoc(doc(this.firebase.firestore, 'usuarios', credencial.user.uid), usuario);

    return credencial.user;
  }

  async entrarComGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const credencial = await signInWithPopup(this.firebase.auth, provider);
    
    // Verificar se é um usuário novo e criar registro no Firestore
    const docUsuario = await getDoc(doc(this.firebase.firestore, 'usuarios', credencial.user.uid));
    
    if (!docUsuario.exists()) {
      const usuario: Usuario = {
        id: credencial.user.uid,
        nome: credencial.user.displayName || 'Usuário Google',
        email: credencial.user.email || '',
        emailCriptografado: this.criptografia.criptografarDado(credencial.user.email || ''),
        telefone: '',
        dataCriacao: new Date(),
        consentimentoLGPD: false, // Será solicitado posteriormente
        dataConsentimentoLGPD: new Date()
      };

      await setDoc(doc(this.firebase.firestore, 'usuarios', credencial.user.uid), usuario);
    }

    return credencial.user;
  }

  async sair(): Promise<void> {
    await signOut(this.firebase.auth);
  }

  async enviarResetSenha(email: string): Promise<void> {
    await sendPasswordResetEmail(this.firebase.auth, email);
  }

  get usuarioAtual(): User | null {
    return this.usuarioAtualSubject.value;
  }

  get estaAutenticado(): boolean {
    return this.usuarioAtual !== null;
  }

  private async atualizarUltimoLogin(uid: string): Promise<void> {
    try {
      await updateDoc(doc(this.firebase.firestore, 'usuarios', uid), {
        ultimoLogin: new Date()
      });
    } catch (error) {
      console.error('Erro ao atualizar último login:', error);
    }
  }

  async obterDadosUsuario(uid: string): Promise<Usuario | null> {
    try {
      const docUsuario = await getDoc(doc(this.firebase.firestore, 'usuarios', uid));
      return docUsuario.exists() ? docUsuario.data() as Usuario : null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  }
}