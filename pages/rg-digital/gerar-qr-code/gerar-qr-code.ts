import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { RG } from "../../../providers/rg/rg.model";
import { Observable } from "../../../../node_modules/rxjs/Observable";
import { Subscription } from "../../../../node_modules/rxjs/Subscription";
import { RgProvider } from "../../../providers/rg/rg";
import { KeycloakService } from "../../../keycloak";

declare var $: any;
@IonicPage()
@Component({
  selector: "page-gerar-qr-code",
  templateUrl: "gerar-qr-code.html"
})
export class GerarQrCodePage {
  createdCode: string;
  rg: RG;
  timer: Subscription;
  countDown: number;
  otp: string;
  cidadaoLogado: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public rgProvider: RgProvider,
    private keycloakService: KeycloakService
  ) { }

  ionViewDidLoad() {
    this.rg = this.navParams.get("rg");
    this.keycloakService.getCidadaoLogado()
      .subscribe(cidadao => {
        this.cidadaoLogado = cidadao;
        this.createdCode = JSON.stringify({
          otp: this.otp,
          email: cidadao.email,
          numeroRg: this.rg.numeroFicha
        });
      });
  }

  ionViewWillEnter() {
    this.timer = Observable.interval(1000).subscribe(x => {
      this.timerUpdate();
    });

    this.timerUpdate();

    this.createdCode = JSON.stringify({
      otp: this.otp,
      email: this.cidadaoLogado.email,
      numeroRg: this.rg.numeroFicha
    });
    $("#createdCode").html("");
    $("#createdCode").qrcode(this.createdCode);
  }

  timerUpdate() {
    let epoch = Math.round(new Date().getTime() / 1000.0);
    let countDown = this.rg.period - (epoch % this.rg.period);
    if (epoch % this.rg.period == 0) {
      this.otp = this.rgProvider.updateOtp(this.rg).otp;
      this.createdCode = JSON.stringify({
        otp: this.otp,
        email: this.cidadaoLogado.email,
        numeroRg: this.rg.numeroFicha
      });
      $("#createdCode").html("");
      $("#createdCode").qrcode(this.createdCode);
    }
    this.countDown = countDown;
    //console.log("timer ", this.countDown);
  }

  ionViewWillLeave() {
    this.timer.unsubscribe();
    //console.log("this.timer.unsubscribe");
  }
}
