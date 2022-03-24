import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UrlRepositoryService } from "./url-repository.service";
import { Observable } from "rxjs";
import { DepositoModel } from "app/models/deposito/DepositoModel";
import { BaseFormService } from "./base-form.service";

interface ApiResult<T> {
  sucesso: boolean;
  mensagem: string;
  Data: T;
}

@Injectable({
  providedIn: "root",
})
export class DepositoService extends BaseFormService<DepositoModel> {
  constructor(
    public http: HttpClient,
    public url: UrlRepositoryService,
  ) {
    super(http, url);
  }

  inserir(model): Observable<any> {
    console.log(1, model);
    return this.http.post(this.url.Usuario.Deposito, model);
  }

}
