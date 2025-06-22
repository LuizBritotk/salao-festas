import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AutenticacaoService } from '../services/autenticacao.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoGuard implements CanActivate {
  constructor(
    private autenticacao: AutenticacaoService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.autenticacao.usuarioAtual$.pipe(
      map(usuario => {
        if (usuario) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      })
    );
  }
}