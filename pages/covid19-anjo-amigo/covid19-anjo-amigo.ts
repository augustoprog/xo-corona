import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the Covid19AnjoAmigoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-covid19-anjo-amigo',
  templateUrl: 'covid19-anjo-amigo.html',
})
export class Covid19AnjoAmigoPage {

  public loader;
  public urlAnjoAmigo: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://anjoamigo.com');

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
