import { Injectable } from '@angular/core';
import { SystemService } from './system.service';
import { AppServerModule } from 'app/app.server.module';
import { AppConfig } from 'app/models/AppConfig';

@Injectable({
  providedIn: 'root'
})

export class UrlRepositoryService {
  constructor(private system: SystemService) {}

  private get Settings(): AppConfig {
    return this.system.LocalSettings;
  }
  
  public Usuario = {
     UsuarioPosicao: this.Settings.BaseApi + '/pesquisa/usuarioposicao', 
     PesquisarUsuario: this.Settings.BaseApi + '/pesquisa/usuario', 
     Deposito: this.Settings.BaseApi + '/cadastro/movimento',
     Ativo: this.Settings.BaseApi + '/pesquisa/trends',
     CadastrarAtivo: this.Settings.BaseApi + '/cadastro/usuarioativo' 
  };

}
