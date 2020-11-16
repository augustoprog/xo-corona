import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Loading, LoadingController, Platform } from 'ionic-angular';
import { SefazProvider } from '../../providers/sefaz/sefaz-provider';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

/**
 * Generated class for the SefazNfeResultadoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sefaz-nfe-resultado',
  templateUrl: 'sefaz-nfe-resultado.html',
})
export class SefazNfeResultadoPage {

  loader: Loading;

  public nfe: any;
  public dtNfe: Date;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private sefazProvider: SefazProvider,
    public file: File,
    private fileOpener: FileOpener,
    private loadingController: LoadingController,
    private toastCtrl: ToastController,
    private platform: Platform) {

    this.nfe = this.navParams.get('nota');
    this.dtNfe = new Date(this.nfe.dh_emissao);
    this.nfe.valor_total ? this.nfe.valor_total = this.nfe.valor_total : this.nfe.valor_total = '00.00'; 
  }

  fileHandleError(err) {
    let toast = this.toastCtrl.create({
      message: 'Não foi possível salvar o arquivo!',
      duration: 2000,
      position: "middle"
    });
    this.loader.dismiss();
    toast.present(toast);
  }

  gerarDanfe() {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.sefazProvider.getDanfe(this.nfe.chave_acesso)
    .subscribe(data => {

      if (data.danfe) {
        let storeFolder = this.file.externalRootDirectory;
        if (this.platform.is('ios'))
          storeFolder = this.file.documentsDirectory;

        this.file.createDir(storeFolder, 'Download', true).then(() => {
            this.file.createFile(storeFolder + 'Download/', `danfe_${this.nfe.chave_acesso}.pdf`, true).then((response) => {
              let toast = this.toastCtrl.create({
                message: 'Danfe salvo no dispositivo!',
                duration: 2000,
                position: "middle"
              });
              toast.present(toast);
              
              const byteCharacters = atob(data.danfe);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
      
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], {type: 'application/pdf'});
              this.file.writeExistingFile(storeFolder + 'Download/', `danfe_${this.nfe.chave_acesso}.pdf`, blob)
              .then((response) => {
      
                this.fileOpener.open(storeFolder + 'Download/' + `danfe_${this.nfe.chave_acesso}.pdf`,'application/pdf').then((response) => {
                  console.log('opened PDF file successfully',response);
                  this.loader.dismiss();
                }).catch(this.fileHandleError); // this.fileOpener

              }).catch(this.fileHandleError); // this.file.writeExistingFile

            }).catch(this.fileHandleError); // this.file.createFile

          }).catch(this.fileHandleError); // this.file.createDir
      } else {
        let toast = this.toastCtrl.create({
          message: 'Danfe não está disponível!',
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