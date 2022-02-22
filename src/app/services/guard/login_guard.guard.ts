import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
// import { UsuarioService } from '../Usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {
  constructor( 
    public router: Router
    ) { }
    
  canActivate() {
    if (window.sessionStorage.getItem("Perfil") != undefined && window.sessionStorage.getItem("Perfil") != "" && window.sessionStorage.getItem("Perfil") != null) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}