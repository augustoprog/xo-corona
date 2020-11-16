import { Component } from "@angular/core";
import { File } from "@ionic-native/file";
import { FileOpener } from "@ionic-native/file-opener";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { AgendamentoProvider } from "../../../providers/agendamento/agendamento";
import { Resultado } from "../../../providers/agendamento/model";
import { getPageIndex, endSession } from "../../../util/common";
import { AlertProvider } from "../../../providers/alert/alert";
/**
 * Generated class for the AgendamentoComprovantePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-agendamento-comprovante",
  templateUrl: "agendamento-comprovante.html"
})
export class AgendamentoComprovantePage {
  agendamento: Resultado;
  menu: boolean = false;
  showSenha: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public agendamentoProvider: AgendamentoProvider,
    public file: File,
    private fileOpener: FileOpener,
    private platform: Platform,
    private alert: AlertProvider
  ) {
    this.menu = this.navParams.get("menu");
    this.agendamento = this.agendamentoProvider.getResultado();

    this.agendamentoProvider.present();
    this.agendamentoProvider
      .getAgendamentoByToken(this.agendamento.protocolo)
      .subscribe(
        data => {
          this.agendamento = { ...data };
          this.agendamentoProvider
            .getParametroServicoUnidade(
              this.agendamento.horarioAgenda.servicoUnidade.servico.categoria
                .orgao.id,
              this.agendamento.horarioAgenda.servicoUnidade.servico.id,
              this.agendamento.horarioAgenda.servicoUnidade.unidadeAtendimento
                .id
            )
            .finally(() => {
              this.agendamentoProvider.dismiss();
            })
            .subscribe(
              data => {
                this.showSenha = data.integracaoSistemaAtende;
              },
              error => {
                endSession(this.navCtrl, this.alert, error);
              }
            );
        },
        error => {
          endSession(this.navCtrl, this.alert, error);
        }
      );

    this.platform.registerBackButtonAction(() => {
      if (this.platform.is("android")) {
        console.log("android");
        this.concluir();
      }
    });
  }

  ionViewDidLoad() {}

  concluir() {
    if (getPageIndex(this.navCtrl.getViews(), "MenuAgendamentoPage") != -1) {
      this.navCtrl.popTo(
        getPageIndex(this.navCtrl.getViews(), "MenuAgendamentoPage")
      );
    } else if (
      getPageIndex(this.navCtrl.getViews(), "AgendamentoConsultaPage") != -1
    ) {
      this.navCtrl.popTo(
        getPageIndex(this.navCtrl.getViews(), "AgendamentoConsultaPage")
      );
    } else if (
      getPageIndex(this.navCtrl.getViews(), "CartaServicoResultPage") != -1
    ) {
      this.navCtrl.popTo(
        getPageIndex(this.navCtrl.getViews(), "CartaServicoResultPage")
      );
    }
  }

  compartilhar() {
    this.agendamentoProvider.comprovanteAgendamento(this.agendamento).subscribe(
      data => {
        this.file
          .writeFile(
            this.file.dataDirectory,
            `comprovante_${this.agendamento.id}.pdf`,
            data,
            {
              replace: true
            }
          )
          .then((res: any) => {
            this.fileOpener
              .open(res.nativeURL, "application/pdf")
              .then(res => {})
              .catch(err => {
                console.log("open error");
              });
          })
          .catch(err => {
            console.log("save error");
          });
      },
      error => {
        console.log(error);
      }
    );

    // fetch("data:application/pdf;base64," + file, {
    //   method: "GET"
    // })
    //   .then(res => res.blob())
    //   .then(blob => {
    //     this.file
    //       .writeFile(
    //         this.file.dataDirectory,
    //         `comprovante_${this.agendamento.id}.pdf`,
    //         blob,
    //         {
    //           replace: true
    //         }
    //       )
    //       .then((res: any) => {
    //         this.fileOpener
    //           .open(res.nativeURL, "application/pdf")
    //           .then(res => {})
    //           .catch(err => {
    //             console.log("open error");
    //           });
    //       })
    //       .catch(err => {
    //         console.log("save error");
    //       });
    //   })
    //   .catch(err => {
    //     console.log("error");
    //   });
  }
}
