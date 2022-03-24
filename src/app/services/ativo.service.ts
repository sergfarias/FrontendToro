import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UrlRepositoryService } from "./url-repository.service";
import { Observable } from "rxjs";
import { AtivoModel2 } from "app/models/usuario/AtivoModel2";
import { BaseFormService } from "./base-form.service";

interface ApiResult<T> {
  sucesso: boolean;
  mensagem: string;
  Data: T;
}

@Injectable({
  providedIn: "root",
})
export class AtivoService extends BaseFormService<AtivoModel2> {
  constructor(
    public http: HttpClient,
    public url: UrlRepositoryService
  ) {
    super(http, url);
  }

  inserir(model): Observable<any> {
    console.log(1, model);
    return this.http.post(this.url.Usuario.CadastrarAtivo, model);
  }

}
