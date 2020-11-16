import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Generated class for the Covid19AtendeEmCasaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-covid19-atende-em-casa',
  templateUrl: 'covid19-atende-em-casa.html',
})
export class Covid19AtendeEmCasaPage {

  public loader;
  public urlAtendeEmCasa: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.atendeemcasa.pe.gov.br');

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private sanitizer: DomSanitizer,
    public loadingController: LoadingController) { }
    
  ionViewDidLoad() {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
  }

  dismissLoad() {
    this.loader.dismiss();
  }

}
