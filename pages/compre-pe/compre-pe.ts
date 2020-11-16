import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../environment';

@IonicPage()
@Component({
  selector: 'page-compre-pe',
  templateUrl: 'compre-pe.html',
})
export class ComprePEPage {

  public loader;
  public urlPage: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.comprePEPage);

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
      this.loader ? 
      this.loader.dismiss() : 
      '';
    }

}
