import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Loading
} from "ionic-angular";
import { NgForm } from "@angular/forms";
import { AlertProvider } from "../../providers/alert/alert";
import {
  FaleConoscoProvider,
  EmailFaleconosco
} from "../../providers/fale-conosco/fale-conosco";
import "rxjs/add/operator/finally";

/**
 * Generated class for the FaleConoscoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-fale-conosco",
  templateUrl: "fale-conosco.html"
})
export class FaleConoscoPage {
  loader: Loading;
  success: boolean = false;
  info: EmailFaleconosco;
  tipos: string[] = ["Elogio", "Reclamação", "Sugestão", "Solicitação"];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private faleConosco: FaleConoscoProvider,
    private alert: AlertProvider,
    public loadingCtrl: LoadingController
  ) {
    this.info = new EmailFaleconosco();
    this.loader = this.loadingCtrl.create({ content: "Enviando..." });
  }

  ionViewDidLoad() {}

  submit($event: Event, form: NgForm) {
    $event.preventDefault();
    if (form.valid) {
      this.loader.present();
      this.faleConosco
        .submit(this.info)
        .finally(() => {
          this.loader.dismiss();
        })
        .subscribe(
          response => {
            this.alert.showSuccess({
              subTitle: "Realizado com Sucesso!",
              msg: "",
              buttons: [
                {
                  text: "ok",
                  handler: _ => {
                    this.navCtrl.pop();
                  }
                }
              ]
            });
          },
          error => {
            this.alert.showError({
              subTitle: "Falha ao enviar email.",
              buttons: [
                {
                  text: "ok",
                  handler: _ => {
                    this.navCtrl.pop();
                  }
                }
              ]
            });
          }
        );
    }
  }
}
