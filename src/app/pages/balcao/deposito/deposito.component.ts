import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { MatDialogRef} from "@angular/material/dialog";
import { FormGroup, FormBuilder } from "@angular/forms";
import { DepositoModel } from "app/models/deposito/DepositoModel";
import { MensagemService } from "app/shared/mensagem/mensagem.service";
import { FormUtilService } from "app/shared/form-utils.service";
import { VeterinariosService } from "app/services/veterinarios.service";
import { LocalStorageService } from "angular-2-local-storage";
import { MatDialog } from "@angular/material/dialog";
import { UsuarioModel } from "app/models/usuario/UsuarioModel";

@Component({
  selector: "deposito",
  templateUrl: "./deposito.component.html",
  styleUrls: ["./deposito.component.scss"],
})
export class DepositoComponent implements OnInit {
  @Output() returnsearch = new EventEmitter<any>();
  BuscandoVeterinario: boolean = false;
  GravandoVeterinario: boolean = false;
  @Input() resetValue: any;
  previusLength = 0;
  formDeposito: FormGroup;
  private modeloApi: DepositoModel = new DepositoModel();
  veterinarioData: DepositoModel;
  public VISIBLE: boolean = false;
  readonly: boolean;
  checked: boolean;
  ModalOpen: boolean = false;
  usuario: UsuarioModel; 
  public IsLoading: boolean = false;
  
  public constructor(
    private dialog: MatDialogRef<DepositoComponent>,
    private formBuilder: FormBuilder,
    private VeterinarioService: VeterinariosService,
    private formUtil: FormUtilService,
    private mensagem: MensagemService,
    public dialog2: MatDialog,
    public local: LocalStorageService
  ) {
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /[0-9]|\//;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  private get modelo(): DepositoModel {
    let model = Object.assign(this.modeloApi, this.formDeposito.value);
    return model;
  }

  private set modelo(modelo: DepositoModel) {
    this.modeloApi = modelo;
    this.formDeposito.patchValue({
      bancoOrigem: modelo.bancoOrigem,
      agenciaOrigem: modelo.agenciaOrigem,
      valor: modelo.valor 
    });
  }

  buildForm() {
    this.formDeposito = this.formBuilder.group({
      bancoOrigem: [null],
      agenciaOrigem: [null],
      valor: [null]
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
        this.formDeposito.reset(this.resetValue);
    } else {
        this.formDeposito.reset();
    }
  }

  public onSubmit(): void {
    this.GravandoVeterinario = true;
    this.formUtil.verificaValidacoes(this.formDeposito);
    if (this.formDeposito.valid) 
    {
      this.inserirOuAtualizar();
    }
    else {
      this.mensagem.enviar("Existem campos inválidos", false);
    }
  }

  private inserirOuAtualizar(): void {
      this.usuario = this.local.get("usuario");
      console.log(this.modelo);
      this.modelo.usuarioId = this.usuario.id;
      this.VeterinarioService.inserir(this.modelo).subscribe(
        () => {
          this.GravandoVeterinario = false;
          this.mensagem.enviar("Dados inseridos com sucesso.");
          this.closeDialog();
        },
        (error) => {
          this.GravandoVeterinario = false;
          this.mensagem.enviar("Falha na inclusão do depósito.", false);
          console.log(error);
        }
      );
  }

  preencherDadosVeterinario(search: DepositoModel) {
    this.formDeposito.get("bancoOrigem").patchValue(search.bancoOrigem);
    this.formDeposito.get("agenciaOrigem").patchValue(search.agenciaOrigem);
    this.formDeposito.get("valor").patchValue(search.valor); 
  }
  
}
