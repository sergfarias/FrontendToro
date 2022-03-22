import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { ROUTE_TRANSITION } from '../../../app.animation';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { UsuarioService } from "app/services/usuario.service";
import { MensagemService } from "app/shared/mensagem/mensagem.service";
import { StoreFrontBudgetComponent } from '../../balcao/home/home.component';
import { LocalStorageService } from "angular-2-local-storage";

const routes: Routes = [
  {
    path: '',
    component: StoreFrontBudgetComponent
  }
];


@Component({
  selector: 'elastic-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})


export class LoginComponent implements OnInit {

  cpf: string;
  password: string;
  ModalOpen: boolean;
  BuscandoUsuario: boolean = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private usuarioService: UsuarioService,
    private mensagem: MensagemService,
    public local: LocalStorageService,
    
  ) { }

  ngOnInit() {
    console.log(1);
  }

  login() {
     if (!this.cpf) {
        this.mensagem.enviar("Informe CPF.",false);
        return;
      }
      if (!this.password) {
        this.mensagem.enviar("Informe password.",false);
        return;
      }
      this.usuarioService.PesquisarUsuario(this.cpf, this.password)
      .subscribe((value) => {
        this.BuscandoUsuario = false;
        if (value == null) {
            this.mensagem.enviar("Usuário informado não existe ou não encontrado.",false);
            return;
        }
        this.local.set("usuario", value);
        console.log(value);
        this.router.navigate(['/home']); 
      },(error) => {
        this.mensagem.enviar("Usuário informado não existe ou não encontrado.",false);
        console.log(error);
      });
  }

  /*  PesquisarUsuario(cpf, senha){
      this.usuarioService.PesquisarUsuario(cpf, senha)
      .subscribe((value) => {
        this.BuscandoUsuario = false;
        if (value == null) {
            this.mensagem.enviar("Usuário informado não existe ou não encontrado.",false);
            return;
        }
        this.router.navigate(['/home']); 
      },(error) => {
        this.mensagem.enviar("Usuário informado não existe ou não encontrado.",false);
        console.log(error);
      });
   }
 */
}
