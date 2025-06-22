import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CriptografiaService {
  private readonly chaveSecreta = 'SALAO_FESTAS_2024_LGPD_COMPLIANCE';

  criptografarDado(dado: string): string {
    if (!dado) return '';
    
    try {
      // Usar SHA-256 para hash irreversível
      return CryptoJS.SHA256(dado + this.chaveSecreta).toString(CryptoJS.enc.Hex);
    } catch (error) {
      console.error('Erro ao criptografar dado:', error);
      return '';
    }
  }

  criptografarDadoReversivel(dado: string): string {
    if (!dado) return '';
    
    try {
      // Usar AES para criptografia reversível (quando necessário)
      return CryptoJS.AES.encrypt(dado, this.chaveSecreta).toString();
    } catch (error) {
      console.error('Erro ao criptografar dado reversível:', error);
      return '';
    }
  }

  descriptografarDado(dadoCriptografado: string): string {
    if (!dadoCriptografado) return '';
    
    try {
      const bytes = CryptoJS.AES.decrypt(dadoCriptografado, this.chaveSecreta);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Erro ao descriptografar dado:', error);
      return '';
    }
  }

  gerarTokenSeguro(): string {
    return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  }

  validarIntegridadeDados(dadoOriginal: string, hashArmazenado: string): boolean {
    const hashCalculado = this.criptografarDado(dadoOriginal);
    return hashCalculado === hashArmazenado;
  }
}