import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { GerarQrCodePage } from "../gerar-qr-code/gerar-qr-code";
import { VisualizarRgPage } from "../visualizar-rg/visualizar-rg";
import { RG } from "../../../providers/rg/rg.model";
import { Observable } from "../../../../node_modules/rxjs/Observable";
import { Subscription } from "../../../../node_modules/rxjs/Subscription";
import { RgProvider } from "../../../providers/rg/rg";

declare const ProgressBar;

@IonicPage()
@Component({
  selector: "page-chave-seguranca",
  templateUrl: "chave-seguranca.html"
})
export class ChaveSegurancaPage {
  rg: RG;
  otpObj: { otp; countDown } = { otp: 0, countDown: 0 };
  countDown: number;
  timer: Subscription;
  seconds: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private rgProvider: RgProvider
  ) {
    this.rg = this.navParams.get("rg");
  }

  ionViewWillEnter() {
    this.otpObj = this.rgProvider.updateOtp(this.rg);

    this.timer = Observable.interval(1000).subscribe(x => {
      this.timerUpdate(this.rg);
    });

    var elementd = document.getElementById("countdown");
    if (!this.seconds) {
      this.seconds = new ProgressBar.Circle(elementd, {
        duration: 1000,
        color: "#046de6",
        trailColor: "#ddd",
        strokeWidth: 5,
        trailWidth: 3
      });
    }
    this.timerUpdate(this.rg);
  }

  timerUpdate(rg) {
    this.otpObj = this.rgProvider.updateOtp(rg);

    this.seconds.animate(this.otpObj.countDown / rg.period, () => {
      //console.log("animate ", this.otpObj.countDown);
    });
    this.seconds.setText(
      '<span class="number">' + this.otpObj.countDown + "</span>"
    );
  }

  ionViewWillLeave() {
    this.timer.unsubscribe();
    //console.log("this.timer.unsubscribe");
  }

  gerarQRCode() {
    this.navCtrl.push(GerarQrCodePage, { rg: this.rg });
  }
  visualizarRG() {
    this.navCtrl.push(VisualizarRgPage, { rg: this.rg });
  }
  cancelar() {
    this.navCtrl.pop();
  }

  // $(function () {
  //     updateOtp();

  //     $('#update').click(function (event) {
  //         updateOtp();
  //         event.preventDefault();
  //     });

  //     $('#secret').keyup(function () {
  //         updateOtp();
  //     });

  //     setInterval(timer, 1000);
  // });
}
