import { Component, ChangeDetectorRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Loading
} from "ionic-angular";
import { NotificacaoDetalhePage } from "../notificacao-detalhe/notificacao-detalhe";
import { NotificacaoProvider } from "../../providers/notificacao/notificacao";
import { DatabaseProvider } from "../../providers/database/database";
import { SQLiteObject } from "@ionic-native/sqlite";
import { KeycloakService } from "../../keycloak";

@IonicPage()
@Component({
  selector: "notificacoes-cidadao",
  templateUrl: "notificacoes-cidadao.html"
})
export class NotificacoesCidadaoPage {
  public loader: Loading;
  private itens_raw: any[] = [];
  public notificacoes: any[] = [];
  private temasNotifica: any;
  private temasUsuario: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    private notificacaoProvider: NotificacaoProvider,
    private databaseProvider: DatabaseProvider,
    private changeDetector: ChangeDetectorRef,
    private keycloakService: KeycloakService
  ) {

  }

  async ionViewDidLoad() {
    this.notificacoes = [];
    await this.init();
  }

  async init() {
    await this.databaseProvider.getDB()
      .then(async (db: SQLiteObject) => {
        await this.keycloakService.getCidadaoLogado()
          .subscribe(async cidadao => {
            let query = 'SELECT id, sn_recebe FROM recebe_notifica WHERE id = 1'
            let params = [];
            if (cidadao) {
              query = query + ' AND usuario = ?';
              params.push(cidadao.id);
            } else {
              query = query + ' AND usuario IS NULL';
            }
            await db.executeSql(query, params)
              .then(async res => {
                if (res.rows.length > 0) {
                  let r = res.rows.item(0);
                  if (r.sn_recebe === 'S') {
                    await this.getListaTodasNotificacoes();
                  }
                }
              })
              .catch(err => {
                console.error('erro no select da config recebe notifica', err);
              });
          });
      });
  }

  async getListaTodasNotificacoes() {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    if (this.notificacoes.length === 0) {
      await this.databaseProvider.getDB()
        .then(async (db: SQLiteObject) => {
          await this.keycloakService.getCidadaoLogado()
            .subscribe(async cidadao => {
              let query = 'SELECT * FROM notifica WHERE excluido = 0'
              let params = [];
              if (cidadao) {
                query = query + ' AND usuario = ?';
                params.push(cidadao.id);
              } else {
                query = query + ' AND usuario IS NULL';
              }
              query = query + ' ORDER BY id DESC';
              await db.executeSql(query, params)
                .then(async res => {
                  if (res.rows.lengt === 0) {
                    await this.loader.dismiss();
                  } else {
                    for (let i = 0; i < res.rows.length; i++) {
                      let element = res.rows.item(i);
                      await this.databaseProvider.getDB()
                        .then(async (db: SQLiteObject) => {
                          await db.transaction(async (tx: any) => {
                            let query = 'SELECT id_tema, ativo, nome_tema FROM temas_notifica where ativo = 1'
                            let params = [];
                            if (cidadao) {
                              query = query + ' AND usuario = ?';
                              params.push(cidadao.id);
                            } else {
                              query = query + ' AND usuario IS NULL';
                            }
                            await tx.executeSql(query, params,
                              //sucesso
                              async (tx: any, res: any) => {
                                if (res.rows.length > 0) {
                                  for (let x = 0; x < res.rows.length; x++) {
                                    let existeTema = this.temasUsuario.find(el => { return el.id_tema === res.rows.item(x).id_tema });
                                    if (!existeTema)
                                      this.temasUsuario.push(res.rows.item(x));
                                  }
                                  await this.notificacaoProvider.getTemasNotificacao(element.id).subscribe(async res => {
                                    this.temasNotifica = res;
                                    await this.checkTemasNotifica(element, this.temasUsuario, this.temasNotifica);
                                  });
                                } else {
                                  this.notificacoes = [];
                                  await this.loader.dismiss();
                                }
                              },
                              //erro
                              async (tx: any, err: any) => {
                                //reject({ tx: tx, err: err })
                                await this.loader.dismiss();
                              });
                          });
                        })
                        .then(async () => {
                          await this.loader.dismiss();
                        })
                        .catch(async e => {
                          await this.loader.dismiss();
                        });
                    }
                    this.changeDetector.detectChanges();
                  }
                })
                .catch(err => {
                  console.error('erro no select count notifica', err);
                });
            });
        });
    } else {
      await this.loader.dismiss();
    }
    await this.loader.dismiss();
  }

  async checkTemasNotifica(element, temasUsuario, temasNotifica) {
    if (temasUsuario.length === 0) {
      this.notificacoes = [];
    } else {
      if (temasNotifica.length > 0) {
        for (let i = 0; i < temasNotifica.length; i++) {
          let temaIt = temasNotifica[i];
          let podeTema = temasUsuario.find(el => { return el.id_tema === temaIt.temaId });
          if (podeTema) {
            let existeNotifica = this.notificacoes.find(el => { return el.id === element.id });
            if (!existeNotifica) {
              if (element.dataCriacao) {
                let dataTratada = element.dataCriacao.replace(/T/g, ' ');
                element.dataCriacao = dataTratada;
              }
              this.notificacoes.push(element);
              this.itens_raw.push(element);
              this.changeDetector.detectChanges();
            }
          }
        }
      } else {
        let existeNotifica = this.notificacoes.find(el => { return el.id === element.id });
        if (!existeNotifica) {
          if (element.dataCriacao) {
            let dataTratada = element.dataCriacao.replace(/T/g, ' ');
            element.dataCriacao = dataTratada;
          }
          this.notificacoes.push(element);
          this.itens_raw.push(element);
          this.changeDetector.detectChanges();
        }
      }
    }
  }

  getItems(ev) {
    // Reset items back to all of the items
    //this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      //let filtro = val.toLowerCase();
      this.notificacoes = this.itens_raw.filter(item => {
        return item.descricao.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          item.titulo.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          item.texto.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else {
      this.notificacoes = this.itens_raw;
    }
    //console.log("Servicos " + this.servicos.length);
  }

  openPage(notificacao) {
    //console.log("Id do servico: ", servicoID);
    if (notificacao.visualizado === 0) {
      this.databaseProvider.getDB()
        .then((db: SQLiteObject) => {
          notificacao.visualizado = 1;
          this.databaseProvider.updateNotificaVisualizado(db, notificacao);
          this.changeDetector.detectChanges();
        });
    }
    this.navCtrl.push(NotificacaoDetalhePage, { notificacao });
  }

  excluir(notificacao) {
    this.databaseProvider.getDB()
      .then((db: SQLiteObject) => {
        notificacao.excluido = 1;
        this.updateNotificaExcluido(db, notificacao);
        this.changeDetector.detectChanges();
      });
  }

  updateNotificaExcluido(db: SQLiteObject, notifica) {
    this.keycloakService.getCidadaoLogado()
      .subscribe(cidadao => {
        let query = 'update notifica set excluido = ? WHERE 1 = 1 AND id = ?'
        let params = [1, notifica.id];
        if (cidadao) {
          query = query + ' AND usuario = ?';
          params.push(cidadao.id);
        } else {
          query = query + ' AND usuario IS NULL';
        }
        db.executeSql(query, params)
          .then(() => {
            this.notificacoes.splice(this.notificacoes.indexOf(notifica), 1);
            this.changeDetector.detectChanges();
          })
          .catch(e => console.error('error', e));
      });
  }

}
