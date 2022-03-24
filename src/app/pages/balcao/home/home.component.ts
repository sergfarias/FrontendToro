import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ROUTE_TRANSITION } from "../../../app.animation";
import { LocalStorageService } from "angular-2-local-storage";
import { MensagemService } from "app/shared/mensagem/mensagem.service";
import { DepositoComponent } from "../deposito/deposito.component";
import { AtivoComponent } from "../ativo/ativo.component";
import { FormControl } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { UsuarioService } from "app/services/usuario.service";
import { UsuarioModel } from "app/models/usuario/UsuarioModel";
import { PosicaoModel } from "app/models/usuario/PosicaoModel";
import { AtivoModel } from "app/models/usuario/AtivoModel";

@Component({
  selector: "home",
  templateUrl: "./home.html",
  styleUrls: ["./home.component.scss"],
  animations: [...ROUTE_TRANSITION],
  host: { "[@routeTransition]": "" },
})
export class StoreFrontBudgetComponent implements OnDestroy, OnInit {
  myControl = new FormControl();
  lista: any[];
  previusLength = 0;
  Username: string = "";
  Password: string = "";
  public IsLoading: boolean = false;
  clickCount: number=0;
  usuario: UsuarioModel; 
  SaldoAtual: string ="";
  SaldoConsolidado: string ="";

  displayedColumns = [
    "symbol",
    "amount",
    "currentPrice"
  ];
  public dataTable: any[];
  public dataSource: MatTableDataSource<any>;

  displayedColumns2 = [
    "symbol",
    "currentPrice"
  ];
  public dataTable2: any[];
  public dataSource2:MatTableDataSource<any>;

  constructor(
    public dialog: MatDialog,
    public change: ChangeDetectorRef,
    public local: LocalStorageService,
    private mensagem: MensagemService,
    private usuarioService: UsuarioService,
  ) {
      this.usuario = this.local.get("usuario");
      this.PesquisarUsuarioPosicao(this.usuario.cpf);
      this.PesquisarAtivo();
  }

  /*  Flag de controle de modal */
  ModalOpen: boolean = false;

  setFocus(element) {
    if (!element || !element.nativeElement) return;
    element.nativeElement.select();
    element.nativeElement.focus();
  }

   dialogClientRegister() {
    const dialogRef = this.dialog.open(AtivoComponent, {
      id: "client-register",
      //width: "540px",
      //height: "385px",
    });
    this.ModalOpen = true;
    dialogRef.afterClosed().subscribe((r) => {
      this.ModalOpen = false;
      this.usuario = this.local.get("usuario");
      this.BuscarUsuario(this.usuario.cpf, this.usuario.senha);
     this.PesquisarUsuarioPosicao(this.usuario.cpf);
 });
  } 

  dialogProviderRegister() {
    const dialogRef = this.dialog.open(DepositoComponent, {
      id: "deposito",
      //width: "640px",
      //height: "480px",
    });
    this.ModalOpen = true;
    dialogRef.afterClosed().subscribe((r) => {
         this.ModalOpen = false;
         this.usuario = this.local.get("usuario");
         this.BuscarUsuario(this.usuario.cpf, this.usuario.senha);
         console.log(90);
        this.PesquisarUsuarioPosicao(this.usuario.cpf);
    });
  }
 
  ngOnInit() {
  }

  ngOnDestroy() {
  }

  Selecionar(linha: any) {
    this.clickCount++;
    var evento: any = event;
    setTimeout(() => {
        if (this.clickCount === 1) {
             // single
             if (evento!=undefined){
               if (evento.key === "Enter") {
                   //this.dialogHorarioRegister(horario);
               }
            }
        } else if (this.clickCount === 2) {
            // double
            this.local.set("ativo", linha);
            this.dialogClientRegister();
        }
        this.clickCount = 0;
    }, 250)
  }
  
  PesquisarUsuarioPosicao(cpf){
    this.IsLoading = true;
    this.usuarioService.UsuarioPosicao(cpf)
    .subscribe((value) => {
        this.SaldoAtual = value.checkingAccountAmount;
        this.SaldoConsolidado = value.consolidated;
        this.IsLoading = false;
        this.dataTable = value.positions; 
        this.dataSource = new MatTableDataSource<PosicaoModel>(this.dataTable);
        this.change.markForCheck();
    },(error) => {
        console.log(error);
        this.IsLoading = false;
        this.dataTable = []; 
        this.dataSource = new MatTableDataSource<PosicaoModel>(this.dataTable);
    });
 }

 PesquisarAtivo(){
  this.IsLoading = true;
  this.usuarioService.Ativo()
  .subscribe((value) => {
      this.IsLoading = false;
      this.dataTable2 = value; 
      this.dataSource2 = new MatTableDataSource<AtivoModel>(this.dataTable2);
      this.change.markForCheck();
  },(error) => {
      console.log(error);
      this.IsLoading = false;
      this.dataTable2 = []; 
      this.dataSource2 = new MatTableDataSource<AtivoModel>(this.dataTable2);
  });
}

   BuscarUsuario(cpf, password){
    this.usuarioService.PesquisarUsuario(cpf, password)
      .subscribe((value) => {
            this.usuario = value;
            this.local.set("usuario", value);
      },(error) => {
            this.usuario = null;
      });
  }

}
