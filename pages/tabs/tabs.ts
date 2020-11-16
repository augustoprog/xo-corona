import { Component } from "@angular/core";

import { MenuServicoPage } from "../menu-servico/menu-servico";
import { MenuInformacaoPage } from "../menu-informacao/menu-informacao";
import { MenuParticipePage } from "../menu-participe/menu-participe";
import { SplashScreen } from "@ionic-native/splash-screen";
import { DatabaseProvider } from "../../providers/database/database";
import { TemaServicosAtivosProvider } from "../../providers/tema-servicos-ativos/tema-servicos-ativos";
import { SQLiteObject } from "@ionic-native/sqlite";
import { KeycloakService } from "../../keycloak";

@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
  tab1Root = MenuServicoPage;
  tab2Root = MenuInformacaoPage;
  tab3Root = MenuParticipePage;

  constructor(private splashScreen: SplashScreen,
    private databaseProvider: DatabaseProvider,
    public temaServicosAtivosProvider: TemaServicosAtivosProvider,
    public keycloakService: KeycloakService) {}

  public temas: any[] = [];
  public itens: any;
  public recebeNotifica: boolean = true;

  async ionViewDidLoad() {
    //console.log("tabs");
    await this.carregarConfiguracoes();
    this.splashScreen.hide();
  }

  async carregarConfiguracoes() {
    await this.databaseProvider.getDB()
      .then(async (db: SQLiteObject) => {
        await this.keycloakService.getCidadaoLogado()
          .subscribe(async cidadao => {
            let query = 'SELECT id, sn_recebe FROM recebe_notifica'
            let params = [];
            if (cidadao) {
              query = query + ' WHERE usuario = ?';
              params.push(cidadao.id);
            } else {
              query = query + ' WHERE usuario IS NULL';
            }
            await db.executeSql(query, params)
              .then(async res => {
                if (res.rows.length > 0) {
                  let r = res.rows.item(0);
                  this.recebeNotifica = (r.sn_recebe === 'S');
                } else {
                  this.recebeNotifica = true;
                  await db.executeSql('insert into recebe_notifica (id, sn_recebe, usuario) values (?,?,?)', [1, 'S', cidadao ? cidadao.id : null])
                    .then(() => console.log('recebe_notifica incluído com sucesso!'))
                    .catch(e => console.error('Erro ao incluir o recebe_notifica ', e));
                }
                if (this.recebeNotifica) {
                  this.verificarTemas();
                } else {
                  this.selectSQLite();
                }
              })
              .catch(err => {
                console.error('erro no select da config recebe notifica', err);
              });
          });

      });
  }

  async verificarTemas() {
    await this.temaServicosAtivosProvider.getTemasAtivos().subscribe((res) => {
      this.itens = res;
      this.selectSQLite();
    });
  }

  async selectSQLite() {
    await this.databaseProvider.getDB()
      .then(async (db: SQLiteObject) => {
        await db.transaction(async (tx: any) => {
          await this.keycloakService.getCidadaoLogado()
            .subscribe(async cidadao => {
              let query = 'SELECT id_tema, ativo, nome_tema FROM temas_notifica'
              let params = [];
              if (cidadao) {
                query = query + ' WHERE usuario = ?';
                params.push(cidadao.id);
              } else {
                query = query + ' WHERE usuario IS NULL';
              }
              await tx.executeSql(query, params,
                //sucesso
                async (tx: any, res: any) => {
                  if (res.rows.length > 0) {
                    if (this.itens && res.rows.length < this.itens.length) {
                      let diff = await this.arr_diff_temas(res.rows, this.itens);
                      for (let i = 0; i < diff.length; i++) {
                        const element = diff[i];
                        await this.databaseProvider.getDB()
                          .then(async (db: SQLiteObject) => {
                            await this.databaseProvider.insertTema(db, element);
                          })
                          .catch(err => {
                            console.error('Erro ao inserir tema', err);
                          });
                      }
                    } else if (this.itens && this.itens.length < res.rows.length) {
                      let diff = await this.arr_diff_temas(this.itens, res.rows);
                      for (let i = 0; i < diff.length; i++) {
                        const element = diff[i];
                        await this.databaseProvider.getDB()
                          .then(async (db: SQLiteObject) => {
                            await this.databaseProvider.deleteTema(db, element);
                          })
                          .catch(err => {
                            console.error('Erro ao deletar tema', err);
                          });
                      };
                    }
                  } else {
                    await this.carregarTemasPrimeiraVez();
                  }
                },
                //erro
                (tx: any, err: any) => {
                  //reject({ tx: tx, err: err })
                });
            });

        });
      });
  }

  async arr_diff_temas(r1, r2) {
    let retorno = [];
    for (let indexR2 = 0; indexR2 < r2.length; indexR2++) {
      const elementR2 = r2[indexR2];
      let foundIdR1 = r1.find(el => { return el.id === elementR2.id });
      if (elementR2.titulo) {
        foundIdR1 = r1.find(el => { return el.nome_tema === elementR2.titulo });
      } else {
        foundIdR1 = r1.find(el => { return el.titulo === elementR2.nome_tema });
      }
      if (!foundIdR1) {
        retorno.push(elementR2);
      }
    }

    return retorno;
  }

  async carregarTemasPrimeiraVez() {
    await this.temaServicosAtivosProvider.getTemasAtivos().subscribe(async (res) => {
      this.itens = res;
      for (let item of this.itens) {
        await this.databaseProvider.getDB()
          .then(async (db: SQLiteObject) => {
            await this.databaseProvider.insertTema(db, item);
            this.temas.push({ id: item.id, nome: item.titulo, ativo: true });
          })
          .catch(err => {
            console.error('erro ao inserir temas pela primeira vez ', err);
          });
      }
    });
  }
}
