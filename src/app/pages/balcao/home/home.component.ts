import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ROUTE_TRANSITION } from "../../../app.animation";
import { LocalStorageService } from "angular-2-local-storage";
import { MensagemService } from "app/shared/mensagem/mensagem.service";
import { LocalSystemService } from "app/services/localsystem.service";
import { DepositoComponent } from "../deposito/deposito.component";
import { AtivoComponent } from "../ativo/ativo.component";
import { FormControl } from "@angular/forms";
import { VeterinariosService } from "app/services/veterinarios.service";
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
  veterinarioId: number =0;
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



  dataContratacao: string;

  DATE = new FormControl(new Date());

  constructor(
    public dialog: MatDialog,
    //public clientes: ClientesService,
    public veterinarios: VeterinariosService,
    public change: ChangeDetectorRef,
    public local: LocalStorageService,
    private sys: LocalSystemService,
    private mensagem: MensagemService,
    private usuarioService: UsuarioService,
  ) {
console.log(0);
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

  /*  Diálogos */
  /* /////////////////////////////// */
   dialogClientRegister() {
    const dialogRef = this.dialog.open(AtivoComponent, {
      id: "client-register",
      //width: "540px",
      //height: "385px",
    });
    this.ModalOpen = true;
    dialogRef.afterClosed().subscribe((r) => (this.ModalOpen = false));
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
        this.PesquisarUsuarioPosicao(this.usuario.cpf);
    });
  }

 /*  dialogHorarioRegister(horario:any) {
    console.log(horario);
    const dialogRef = this.dialog.open(ScheduleRegisterComponent, {
      id: "schedule-register",
      data: {
        Horario: horario,
        DataContratacao: this.dataContratacao
      } });
    this.ModalOpen = true;
    dialogRef.afterClosed().subscribe((r) => (this.ModalOpen = false));
  } */

   /* dialogAttendanceRegister() {
    const dialogRef = this.dialog.open(AtivoComponent, {
      id: "attendance-register",
    });
    this.ModalOpen = true;
    dialogRef.afterClosed().subscribe((r) => (this.ModalOpen = false));
  }  */


  /*  Implementações do componente */

  ngOnInit() {
      
  }

  ngOnDestroy() {
  }

  /* /////////////////////////////// */

  
  /* Listener global de eventos do teclado */
  //@HostListener("window:keyup", ["$event"])
  /* @HostListener("window:keydown", ["$event"])
  keyEvent(event: KeyboardEvent) {
    if (this.ModalOpen) return;

    if (event.ctrlKey && event.which == 13) {
    } else if (event.altKey && event.key === "F2") {
    } else if (event.altKey && event.key === "F3") {
    } else if (event.altKey && event.key === "F5") {
      //CLIENTE
      this.dialogClientRegister();
    }
  } */

  keyPress(event: KeyboardEvent) {
    if (event.key == "ArrowDown" || event.key == "ArrowUp")
      //setas
      return;

    const pattern = /[0-9]|\//;
    const inputChar = event.key; //String.fromCharCode(event.charCode); ---> para Keypress
    if (!pattern.test(inputChar)) {
      //havia criado um contado para pesquisar a cada tres letras digitas.
      this.previusLength = this.previusLength + 1;
      if (this.previusLength == 3) {
        this.previusLength = 0;
        //this.pesquisarVeterinario();
      }
    } else this.lista = [];
  }


  
  Selecionar(linha: any) {
    console.log(9);
    this.clickCount++;
    var evento: any = event;
    console.log(linha);
    //console.log(this.quantidades);
    setTimeout(() => {
        if (this.clickCount === 1) {
             console.log(evento);
             // single
             if (evento!=undefined){
               if (evento.key === "Enter") {
                   //this.dialogHorarioRegister(horario);
               }
            }
        } else if (this.clickCount === 2) {
            // double
            //this.dialogHorarioRegister(horario);
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
        //console.log(this.dataSource);
        this.change.markForCheck();
        //console.log(this.SaldoAtual);
        //console.log(value);
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
      //console.log(this.dataSource2);
      this.change.markForCheck();
      //console.log(this.SaldoAtual);
      //console.log(value);
  },(error) => {
      console.log(error);
      this.IsLoading = false;
      this.dataTable2 = []; 
      this.dataSource2 = new MatTableDataSource<AtivoModel>(this.dataTable2);
  });
}


  /**
   * Limpa o estado de armazenamento de orçamento no LocalStorage do navegador.
   */
  public LimparCache() {
    this.local.set("d1000.Orcamento", null);
  }

}
