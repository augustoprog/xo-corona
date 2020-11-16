import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  Loading
} from "ionic-angular";
import { isInvalidModel, applyPhoneMask, getErrorMessage } from "../../util/common";
import { AlertaCelularProvider } from "../../providers/alerta-celular/alerta-celular";
import { NgForm } from "@angular/forms";
import { AlertProvider } from "../../providers/alert/alert";
import { HttpErrorResponse } from "@angular/common/http";
import { KeycloakService } from "../../keycloak";
import { LoginPage } from "../login/login";
@IonicPage()
@Component({
  selector: "page-alerta-celular-informar",
  templateUrl: "alerta-celular-informar.html"
})
export class AlertaCelularInformarPage {
  loader: Loading;
  selectActive: boolean = false;
  dataOcorrido;
  isInvalidModel = isInvalidModel;
  celular: any;
  btnLabel = "ESTOU CIENTE, ALERTAR!";
  isAlert: boolean = true;
  // REMOVER ALERTA

  applyMask = applyPhoneMask;

  orientacoes = [
    "O alerta poderá ser realizado sem o registro prévio do Boletim de Ocorrência (BO);",
    "Para que o alerta sem BO não seja cancelado, deve ser realizado o registro da ocorrência em qualquer delegacia da Polícia Civil do Estado de Pernambuco ou via Delegacia pela Internet (<strong>servicos.sds.pe.gov.br/delegacia/</strong>) dentro do prazo de 48 horas após o registro do alerta;",
    "No caso de alerta com boletim de ocorrência já registrado, serão validados, no prazo de 24 horas, o número do BO e se consta na ocorrência um aparelho celular como objeto envolvido. No caso de BO registrado sem o IMEI não se faz necessário novo registro da ocorrência;",
    "A data do ocorrido precisa ser a mesma informada no BO;"
  ];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertaService: AlertaCelularProvider,
    private alert: AlertProvider,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private keycloakService: KeycloakService,
  ) { }

  ionViewDidLoad() {
    let aparelhoId = this.navParams.get("id");
    if (aparelhoId) {
      this.present();
      this.alertaService.getAparelho(aparelhoId).subscribe(
        data => {
          this.dismiss();
          this.celular = data;
          if (this.celular.situacaoAlerta && this.celular.situacaoAlerta == 1) {
            this.btnLabel = "REMOVER ALERTA";
            this.isAlert = false;
          }
        },
        error => this.tratarErroServico(error)
      );
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid && this.isAlert) {
      return false;
    }

    if (this.celular.situacaoAlerta && this.celular.situacaoAlerta == 1) {
      this.celular.dataOcorrido = null;
      this.celular.situacaoAlerta = 0;
    } else {
      this.celular.dataOcorrido = new Date(this.dataOcorrido).getTime();
      this.celular.situacaoAlerta = 1;
      if (this.celular.dataOcorrido > new Date().getTime()) {
        this.alert.showError({
          subTitle: "A data do ocorrido não pode ser uma data futura.",
          msg: "",
          buttons: [{ text: "OK" }]
        });
        return false;
      }
    }
    this.present();
    this.alertaService.putAparelho(this.celular).subscribe(
      data => {
        this.dismiss();
        let title =
          "<span class='alert-ico'><span class='mr-auto ml-auto col-3'><img src='assets/images/success_phone.png' /></span></span>";
        let subTitle =
          "<span class='alert-title'>Aparelho alertado com sucesso!</span>";
        if (!this.isAlert) {
          subTitle =
            "<span class='alert-title'>Alerta removido com sucesso!</span>";
        }

        const alert = this.alertCtrl.create({
          title: title,
          subTitle: subTitle,
          message: "",
          cssClass: "custom-alert",
          buttons: [
            {
              text: "OK",
              role: "cancel",
              handler: () => {
                this.navCtrl.pop();
              }
            }
          ]
        });
        alert.present();
      },
      error => this.tratarErroServico(error)
    );
  }

  onClose() {
    this.navCtrl.pop();
  }

  loaderCount: any[] = new Array();
  present() {
    if (this.loaderCount.length == 0) {
      this.loader = this.loadingController.create({
        content: "Carregando..."
      });
      this.loader.present();
    }
    this.loaderCount.push(true);
  }
  dismiss() {
    this.loaderCount.pop();
    if (this.loaderCount.length == 0) {
      this.loader.dismiss();
    }
  }

  active() {
    this.selectActive = !this.selectActive;
  }

  private tratarErroServico(e: any, title?: string) {
    if(!!this.loader && !!this.loader.dismiss) {
      this.loader.dismiss();
    }
    if (e instanceof HttpErrorResponse && e.status == 403) {
      this.alert.showError({
        subTitle: title || "Atenção",
        msg: "A sua sessão expirou, favor efetue o login novamente.",
        buttons: [
          {
            text: "OK",
            handler: () => {
              this.keycloakService.logout();
              this.navCtrl.setRoot(LoginPage);
            }
          }
        ]
      });
    } else {
      this.alert.showError({
        subTitle: title || "Erro!",
        msg: getErrorMessage(e),
        buttons: [{ text: "OK" }]
      });
    }
  }
}
