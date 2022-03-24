import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UrlRepositoryService } from "./url-repository.service";
import { LocalStorageService } from "angular-2-local-storage";
import { Observable } from "rxjs";
import { UsuarioModel } from "app/models/usuario/UsuarioModel";
import { AtivoModel } from "app/models/usuario/AtivoModel";
import { UsuarioPosicaoModel } from "app/models/usuario/UsuarioPosicaoModel";
import { BaseFormService } from "./base-form.service";

interface ApiResult<T> {
  sucesso: boolean;
  mensagem: string;
  Data: T;
}

@Injectable({
  providedIn: "root",
})
export class UsuarioService extends BaseFormService<UsuarioModel> {
  constructor(
    public http: HttpClient,
    public url: UrlRepositoryService,
    public local: LocalStorageService
  ) {
    super(http, url);
  }
  
  public PesquisarUsuario(cpf, senha): Observable<UsuarioModel> {
    let url = "";
    url = this.url.Usuario.PesquisarUsuario + "?cpf=" + cpf + "&senha="+ senha;
    return this.http.get<UsuarioModel>(url);
  }

  public UsuarioPosicao(cpf): Observable<UsuarioPosicaoModel> {
    let url = "";
    url = this.url.Usuario.UsuarioPosicao + "?cpf=" + cpf ;
    return this.http.get<UsuarioPosicaoModel>(url);
  }

  public Ativo(): Observable<AtivoModel[]> {
    let url = "";
    url = this.url.Usuario.Ativo;
    return this.http.get<AtivoModel[]>(url);
  }

}
