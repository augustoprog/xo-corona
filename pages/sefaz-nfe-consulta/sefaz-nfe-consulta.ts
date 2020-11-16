import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Loading, LoadingController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { SefazProvider, NFE } from '../../providers/sefaz/sefaz-provider';
import { SefazNfeResultadoPage } from '../sefaz-nfe-resultado/sefaz-nfe-resultado';

/**
 * Generated class for the SefazNfeConsultaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sefaz-nfe-consulta',
  templateUrl: 'sefaz-nfe-consulta.html',
})
export class SefazNfeConsultaPage {
  loader: Loading;

  public chaveAcesso: string = '';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private sefazProvider: SefazProvider) {}

  openBarcode() {
    let opt: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showTorchButton: true,
      orientation: 'landscape',
      prompt: ''
    };
    this.barcodeScanner.scan(opt).then(
      barcodeData => {
        if (!barcodeData.cancelled) {
          this.chaveAcesso = barcodeData.text;
        }

      },
      err => {
        let toast = this.toastCtrl.create({
          message: "Não foi possível ler a chave de acesso. Tente novamente.",
          duration: 2000,
          position: "middle"
        });
        toast.present(toast);
      }
    );
  }

  consultarNfe() {
    console.log('chegou!');
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.sefazProvider.getNFE(this.chaveAcesso)
      .subscribe((nota: NFE) => {
        if (nota.status === 118 && nota.motivo === 'DF-e Localizado') {
          this.loader.dismiss();
          this.navCtrl.push(SefazNfeResultadoPage, { nota });
        } else {
          let toast = this.toastCtrl.create({
            message: nota.motivo,
            duration: 2000,
            position: "middle"
          });
          this.loader.dismiss();
          toast.present(toast);
        }
      });
  }

  ionViewDidLoad() {
    
  }

}
