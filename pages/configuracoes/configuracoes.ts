import { Component, ChangeDetectorRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  App
} from "ionic-angular";
import { ToastController } from "ionic-angular";
import { TemaServicosAtivosProvider } from '../../providers/tema-servicos-ativos/tema-servicos-ativos';
import { DatabaseProvider } from "../../providers/database/database";
import { SQLiteObject } from "@ionic-native/sqlite";
import { KeycloakService } from "../../keycloak";

@IonicPage()
@Component({
  selector: "page-configuracoes",
  templateUrl: "configuracoes.html"
})
export class ConfiguracoesPage {

  public temas: any[] = [];
  itens: any;
  public chkTodos: boolean = true;
  public recebeNotifica: boolean = true;

  constructor(
    public _app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public temaServicosAtivosProvider: TemaServicosAtivosProvider,
    private databaseProvider: DatabaseProvider,
    private changeDetector: ChangeDetectorRef,
    private keycloakService: KeycloakService
  ) { }

  ionViewDidLoad() {
    this.databaseProvider.getDB()
      .then((db: SQLiteObject) => {
        this.keycloakService.getCidadaoLogado()
          .subscribe(cidadao => {
            let query = 'SELECT id, sn_recebe FROM recebe_notifica'
            let params = [];
            if (cidadao) {
              query = query + ' WHERE usuario = ?';
              params.push(cidadao.id);
            }
            db.executeSql(query, params)
              .then(res => {
                if (res.rows.length > 0) {
                  let r = res.rows.item(0);
                  this.recebeNotifica = (r.sn_recebe === 'S');
                }
                this.selectSQLite();
              })
              .catch(err => {
                console.error('erro no select da config recebe notifica', err);
              });
          });
      });
  }

  selectSQLite() {
    this.databaseProvider.getDB()
      .then((db: SQLiteObject) => {
        db.transaction((tx: any) => {
          this.keycloakService.getCidadaoLogado()
            .subscribe(cidadao => {
              let query = 'SELECT id_tema, ativo, nome_tema FROM temas_notifica'
              let params = [];
              if (cidadao) {
                query = query + ' WHERE usuario = ?';
                params.push(cidadao.id);
              }
              tx.executeSql(query, params,
                //sucesso
                async (tx: any, res: any) => {
                  if (res.rows.length > 0) {
                    this.carregarTemasSQLite(res);
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

  carregarTemasSQLite(res: any) {
    this.temas = [];
    for (var x = 0; x < res.rows.length; x++) {
      const element = res.rows.item(x);
      this.temas.push({ id: element.id_tema, nome: element.nome_tema, ativo: element.ativo });
    }
    let countInativos = 0;
    for (let i = 0; i < this.temas.length; i++) {
      if (this.temas[i].ativo === 0)
        countInativos++;
    }
    this.chkTodos = countInativos > 0 ? false : true;
    this.changeDetector.detectChanges();
  }

  showToast(position: string) {
    let toast = this.toastCtrl.create({
      message: "Ainda não implementado.",
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }

  changeTodos() {
    this.temas.forEach(tema => {
      tema.ativo = this.chkTodos;
      this.changeTema(tema);
    });
  }

  changeTema(tema) {
    this.databaseProvider.getDB()
      .then((db: SQLiteObject) => {
        this.databaseProvider.updateTemaAtivo(db, tema);
        let countAtivos = 0;
        for (let i = 0; i < this.temas.length; i++) {
          this.temas[i].ativo ? countAtivos++ : '';
        }
        if (countAtivos === this.temas.length) {
          this.chkTodos = true;
        } else {
          this.chkTodos = false;
        }
        this.changeDetector.detectChanges();
      })
      .catch(err => {
        console.error('Erro ao atualizar tema', err);
      });
  }

  changeRecebe(recebeNotifica) {
    this.recebeNotifica = recebeNotifica;
    this.databaseProvider.getDB()
      .then((db: SQLiteObject) => {
        this.keycloakService.getCidadaoLogado()
          .subscribe(cidadao => {
            db.executeSql('update recebe_notifica set sn_recebe = ?', [recebeNotifica ? 'S' : 'N', cidadao ? cidadao.id : null])
              .then(() => console.log('alterado o recebe_notifica para ' + recebeNotifica))
              .catch(e => console.error('error', e));
          });
      })
      .catch(err => {
        console.error('Erro ao atualizar recebe', err);
      });
  }

  ionViewWillEnter() {

  }

  ionViewDidLeave() {

  }
}
