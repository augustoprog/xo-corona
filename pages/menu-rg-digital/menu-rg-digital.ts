import { Component } from "@angular/core";
import {
  AlertController,
  IonicPage,
  NavController,
  NavParams
} from "ionic-angular";
import { PinSegurancaPage } from "../rg-digital/pin-seguranca/pin-seguranca";
import {
  BarcodeScanner,
  BarcodeScannerOptions
} from "@ionic-native/barcode-scanner";
import { RgProvider } from "../../providers/rg/rg";
import { RG } from "../../providers/rg/rg.model";
import { applyRgMask, getErrorMessage } from "../../util/common";
import { PinDesbloquearPage } from "../rg-digital/pin-desbloquear/pin-desbloquear";
import "rxjs/add/operator/switchMap";
import { HttpErrorResponse } from "@angular/common/http";
import { LoginPage } from "../login/login";
import { AlertProvider } from "../../providers/alert/alert";
import { KeycloakService } from "../../keycloak";


@IonicPage()
@Component({
  selector: "page-menu-rg-digital",
  templateUrl: "menu-rg-digital.html"
})
export class MenuRgDigitalPage {
  scannedCode: string;
  rgs: RG[] = [];
  _applyRgMask = applyRgMask;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private barcodeScanner: BarcodeScanner,
    private rgProvider: RgProvider,
    private alert: AlertProvider,
    private keycloakService: KeycloakService
  ) {}

  ionViewWillEnter() {
    this.rgProvider.getAll()
      .subscribe(
        rgs => this.rgs = rgs,
        error => this.tratarErroServico(error, "Erro ao tentar recuperar os RGs"));
  }

  scanearQrCode() {
    let opt: BarcodeScannerOptions = {
      formats: "QR_CODE"
    };
    this.barcodeScanner.scan(opt).then(
      barcodeData => {
        if (!barcodeData.cancelled) {
          this.scannedCode = barcodeData.text;
          this.navCtrl.push(PinSegurancaPage, {
            rg: JSON.parse(atob(barcodeData.text))
          });
        }
      },
      err => {
        //console.log("Error: ", err);
      }
    );
  }

  editar() {}

  pin(item) {
    this.navCtrl.push(PinDesbloquearPage, {
      rg: item
    });
  }

  confirmDelete(item: any) {
    let title =
      "<span class='alert-ico'><span class='mr-auto ml-auto col-4'><img src='assets/images/warning@2x.png' /></span></span>";
    let subTitle =
      "<span class='alert-title'>Você tem certeza que deseja excluir o RG?</span>";
    let msg = "<div class='alert-msg round-5 p-2 brd-light-red brd'>";
    msg += '<div class="d-flex align-items-center flex-1 mb-1">';
    msg +=
      '<img class="img-fluid id-card" src="assets/images/id-card-red@2x.png" alt="RG" />';
    msg +=
      '<div class="font-roboto-medium font-15 font-flex color-light-red ml-2">';
    msg += '<span class="font-roboto-bold mr-2">RG</span>';
    msg += `<span>${this._applyRgMask(item.rg.numero)}</span>`;
    msg += "</div>";
    msg += "</div>";
    // msg += "<div class='text-left'>";
    // msg +=
    //   '<span class="font-12 font-roboto-bold color-light-red mr-1">Org:</span>';
    // msg +=
    //   '<span class="font-12 font-roboto-regular color-light-red mr-2">SSP/PE</span>';
    // msg +=
    //   '<span class="font-12 font-roboto-bold color-light-red mr-1">Ex:</span>';
    // msg +=
    //   '<span class="font-12 font-roboto-regular color-light-red">20/10/2016</span>';
    // msg += "</div>";
    msg += "</div>";
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      message: msg,
      cssClass: "custom-alert",
      buttons: [
        {
          text: "Sim",
          handler: () => {
            /*  this.loader = this.loadingController.create({
              content: "Carregando..."
            });
            this.loader.present(); */

            this.rgProvider.remove(item)
              .switchMap(() => this.rgProvider.getAll())
              .subscribe(rgs => {
                this.rgs = rgs;
                this.sucesso();
              },
              error => this.tratarErroServico(error, "Erro ao tentar remover o RG"));
          }
        },
        {
          text: "Não",
          role: "cancel",
          handler: () => {
            ////console.log('ão clicked');
          }
        }
      ]
    });
    alert.present();
  }

  sucesso() {
    let title =
      "<span class='alert-ico'><span class='mr-auto ml-auto'><img src='assets/images/sucess.png' /></span></span>";
    let subTitle = "<span class='alert-title'>RG excluido com sucesso!</span>";
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      cssClass: "custom-alert",
      buttons: [
        {
          text: "FECHAR",
          role: "cancel",
          handler: () => {}
        }
      ]
    });
    alert.present();
  }

  private tratarErroServico(e: any, title?: string) {
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
