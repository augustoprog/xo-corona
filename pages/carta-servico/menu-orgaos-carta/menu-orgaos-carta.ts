import "rxjs/add/operator/finally";
import { Component } from "@angular/core";
import { App, IonicPage, LoadingController, NavController, NavParams } from "ionic-angular";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/finally";
import "rxjs/add/operator/mergeMap";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { AgendamentoProvider } from "../../../providers/agendamento/agendamento";
import { CartaServicoResultPage } from "../carta-servico-result/carta-servico-result";
import { CartaServicoProvider } from "./../../../providers/carta-servico-provider";

/**
 * Generated class for the DetranConsultaCnh page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-menu-orgaos-carta",
  templateUrl: "./menu-orgaos-carta.html"
})
export class MenuOrgaosCartaPage {
  subs: Subscription;
  loaded: boolean;
  public loader;
  private orgaos: any[] = [];
  listaOriginal;
  servicos = [];
  searchText: string;
  orgServ: any[];
  rawOrgServ: any[];

  constructor(
    public navCtrl: NavController,
    private app: App,
    public navParams: NavParams,
    private cartaServicoProvider: CartaServicoProvider,
    public loadingController: LoadingController, // private ref: ChangeDetectorRef
    private agendamentoProvider: AgendamentoProvider
  ) {}

  getListaOrgaos() {
    this.subs = this.agendamentoProvider
      .fetchServicosComHorario()
      .flatMap(() =>
        this.cartaServicoProvider
          .getListaOrgaos()
          .flatMap(res => {
            let list = [];
            this.orgaos = res;
            this.listaOriginal = this.orgaos;
            for (let i = 0; i < this.orgaos.length; i++) {
              this.servicos[this.orgaos[i].id] = [];
              list.push(
                this.cartaServicoProvider.getListaServicos(this.orgaos[i].id)
              );
            }
            return Observable.merge(...list);
          })
          .finally(() => {
            this.loader.dismiss();

            let temp: any[] = [];
            for (let i = 0; i < this.orgaos.length; i++) {
              temp.push({
                nome: this.orgaos[i].nome,
                sigla: this.orgaos[i].sigla
              });
              for (
                let j = 0;
                j < this.servicos[this.orgaos[i].id].length;
                j++
              ) {
                temp.push(this.servicos[this.orgaos[i].id][j]);
              }
            }
            this.orgServ = temp;
            this.rawOrgServ = temp;
            // console.log(this.orgServ);
            // this.ref.detectChanges();
          })
      )
      .subscribe((res: any[]) => {
        for (let i = 0; i < res.length; i++) {
          this.servicos[res[i].categoria.orgao.id].push(res[i]);
        }
        //console.log("Foi");

        //this.ref.detectChanges();
      });
  }

  onSearch() {
    let temp: any[] = [];
    for (let i = 0; i < this.orgaos.length; i++) {
      temp.push({
        nome: this.orgaos[i].nome,
        sigla: this.orgaos[i].sigla
      });
      let itemCount = 0;
      for (let j = 0; j < this.servicos[this.orgaos[i].id].length; j++) {
        if (
          this.servicos[this.orgaos[i].id][j].nome
            .toLowerCase()
            .indexOf(this.searchText.toLowerCase()) != -1
        ) {
          temp.push(this.servicos[this.orgaos[i].id][j]);
          itemCount++;
        }
      }
      if (itemCount == 0) {
        temp.pop();
      }
    }
    this.orgServ = temp;
  }

  initializeItems() {
    this.orgaos = this.listaOriginal;
  }

  ionViewDidLoad() {
    this.loaded = true;
    // seleciona o nó alvo
    // var target: NodeListOf<Element> = document.querySelectorAll(
    //   "page-menu-orgaos-carta .d-inline"
    // );

    // // cria uma nova instância de observador
    // var observer = new MutationObserver(function(mutations) {
    //   mutations.forEach(function(mutation) {
    //     //console.log(mutation.type);
    //   });
    // });

    // // configuração do observador:
    // var config = { attributes: true, childList: true, characterData: true };

    // // passar o nó alvo, bem como as opções de observação
    // for (let i = 0; i < target.length; i++) {
    //   const element = target.item(i);
    //   observer.observe(element, config);
    // }
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.getListaOrgaos();
  }

  ionViewDidLeave() {
    this.subs.unsubscribe();
    this.loader.dismiss();
  }

  openPage(servicoId) {
    ////console.log('Id do orgao: ',orgaoID);
    this.app.getRootNav().push(CartaServicoResultPage, {
      id: servicoId
    });
  }

  getListaServicos(id) {
    this.cartaServicoProvider.getListaServicos(id).subscribe(res => {
      this.servicos = res;
      //   this.tituloOrgao = res[0].categoria.orgao.sigla;
      this.listaOriginal = this.servicos;
      ////console.log('this.servicos: ', this.servicos);
      this.loader.dismiss();
    });
  }

  cacheItems() {
    sessionStorage.setItem("orgaos", JSON.stringify(this.orgaos));
    sessionStorage.setItem("servicos", JSON.stringify(this.servicos));
  }

  reloadItemsFromCache() {
    try {
      this.orgaos = JSON.parse(sessionStorage.getItem("orgaos"));
      this.servicos = JSON.parse(sessionStorage.getItem("servicos"));
    } catch (e) {}
  }

  // checkChildren(item: HTMLElement) {
  //   if (this.loaded) {
  //     return item.children.length;
  //   }
  //   return true;
  // }
}
