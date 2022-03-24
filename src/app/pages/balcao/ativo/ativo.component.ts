import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { MatDialogRef} from "@angular/material/dialog";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MensagemService } from "app/shared/mensagem/mensagem.service";
import { FormUtilService } from "app/shared/form-utils.service";
import { AtivoService } from "app/services/ativo.service";
import { LocalStorageService } from "angular-2-local-storage";
import { MatDialog } from "@angular/material/dialog";
import { UsuarioModel } from "app/models/usuario/UsuarioModel";
import { AtivoModel } from "app/models/usuario/AtivoModel";
import { AtivoModel2 } from "app/models/usuario/AtivoModel2";

@Component({
  selector: "ativo",
  templateUrl: "./ativo.component.html",
  styleUrls: ["./ativo.component.scss"],
})
export class AtivoComponent implements OnInit {
  Gravando: boolean = false;
  @Input() resetValue: any;
  formAtivo: FormGroup;
  private ativoGravar: AtivoModel2 = new AtivoModel2(); 
  readonly: boolean;
  usuario: UsuarioModel;
  ativo1: AtivoModel; 
  public IsLoading: boolean = false;
  preco: string;
  sigla: string;
  quantidade: string;
  
  public constructor(
    private dialog: MatDialogRef<AtivoComponent>,
    private formBuilder: FormBuilder,
    private ativoService: AtivoService,
    private formUtil: FormUtilService,
    private mensagem: MensagemService,
    public dialog2: MatDialog,
    public local: LocalStorageService,
  ) {
      //this.usuario = this.local.get("usuario");
      this.ativo1 = this.local.get("ativo");
      this.sigla = this.ativo1.symbol;
      this.preco = this.ativo1.currentPrice;   
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /[0-9]|\//;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  buildForm() {
    this.formAtivo = this.formBuilder.group({
      quantidade: [null]
       });
  }

  ngOnInit() {
    this.buildForm();
  }

  closeDialog() {
    this.dialog.close({});
  }

  limpar(): void {
    if (this.resetValue) {
        this.formAtivo.reset(this.resetValue);
    } else {
        this.formAtivo.reset();
    }
  }

  public onSubmit(): void {
    console.log(2);
    this.Gravando = true;
    this.formUtil.verificaValidacoes(this.formAtivo);
    if (this.formAtivo.valid) 
    {
      this.inserir();
    }
    else {
      this.mensagem.enviar("Existem campos inválidos", false);
    }
  }

  private inserir(): void {
      this.usuario = this.local.get("usuario");
      if (!this.quantidade){
        this.mensagem.enviar("Digite a quantidade.");
        this.Gravando = false;
        return;
      }
      var custo = ((+this.quantidade) * (+this.preco));
      if (+this.usuario.saldo < custo){
        this.mensagem.enviar("Saldo insuficiente para fazer a compra.");
        this.Gravando = false;
        return;
      }
      this.ativoGravar.usuarioId = this.usuario.id;
      this.ativoGravar.quantidade = this.quantidade;
      this.ativoGravar.sigla = this.sigla;
       this.ativoService.inserir(this.ativoGravar).subscribe(
        () => {
          this.Gravando = false;
          this.mensagem.enviar("Dados inseridos com sucesso.");
          this.closeDialog();
        },
        (error) => {
          this.Gravando = false;
          this.mensagem.enviar("Falha na inclusão do ativo.", false);
          console.log(error);
        }
      );
  }

}
