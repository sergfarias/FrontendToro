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
import { MatTableDataSource } from "@angular/material/table";
import { UsuarioService } from "app/services/usuario.service";
import { AtivoModel } from "app/models/usuario/AtivoModel";
import { AtivoModel2 } from "app/models/usuario/AtivoModel2";

@Component({
  selector: "ativo",
  templateUrl: "./ativo.component.html",
  styleUrls: ["./ativo.component.scss"],
})
export class AtivoComponent implements OnInit {
  @Output() returnsearch = new EventEmitter<any>();
  BuscandoVeterinario: boolean = false;
  GravandoVeterinario: boolean = false;
  @Input() resetValue: any;
  previusLength = 0;
  formAtivo: FormGroup;
  private modeloApi: DepositoModel = new DepositoModel();
  veterinarioData: DepositoModel;
  private ativoGravar: AtivoModel2 = new AtivoModel2(); 
  public VISIBLE: boolean = false;
  readonly: boolean;
  checked: boolean;
  ModalOpen: boolean = false;
  usuario: UsuarioModel;
  ativo: AtivoModel; 
  public IsLoading: boolean = false;
  clickCount: number=0;
  preco: string;
  sigla: string;
  quantidade: string;

  /* displayedColumns = [
    "symbol",
    "currentPrice", 
    "QTD"
  ];
  public dataTable: AtivoModel[];
  public dataSource = new MatTableDataSource<AtivoModel>([]);
 */
  public constructor(
    private dialog: MatDialogRef<AtivoComponent>,
    private formBuilder: FormBuilder,
    private VeterinarioService: VeterinariosService,
    private formUtil: FormUtilService,
    private mensagem: MensagemService,
    public dialog2: MatDialog,
    public local: LocalStorageService,
    private usuarioService: UsuarioService
  ) {
      //this.usuario = this.local.get("usuario");
      this.ativo = this.local.get("ativo");
      console.log(this.ativo);
      this.sigla = this.ativo.symbol;
      this.preco = this.ativo.currentPrice;   
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /[0-9]|\//;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  /* private get modelo(): DepositoModel {
    let model = Object.assign(this.modeloApi, this.formAtivo.value);
    return model;
  }

  private set modelo(modelo: DepositoModel) {
    this.modeloApi = modelo;
    this.formAtivo.patchValue({
      bancoOrigem: modelo.bancoOrigem,
      agenciaOrigem: modelo.agenciaOrigem,
      valor: modelo.valor 
    });
  }
 */
  buildForm() {
    this.formAtivo = this.formBuilder.group({
      //sigla: [null],
      //preco: [null],
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
    this.GravandoVeterinario = true;
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
      //console.log(this.modelo);
      //console.log(this.dataTable);
      //console.log(this.quantidades);
      this.ativoGravar.usuarioId = this.usuario.id;
      this.ativoGravar.quantidade = this.quantidade;
      this.ativoGravar.sigla = this.sigla;
      console.log(33);
       this.VeterinarioService.inserir(this.ativoGravar).subscribe(
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
    this.formAtivo.get("bancoOrigem").patchValue(search.bancoOrigem);
    this.formAtivo.get("agenciaOrigem").patchValue(search.agenciaOrigem);
    this.formAtivo.get("valor").patchValue(search.valor); 
  }
  
  
 

}
