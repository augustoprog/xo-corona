import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, Platform } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Market } from '@ionic-native/market';

/**
 * Generated class for the Covid19DycovidPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-covid19-dycovid',
  templateUrl: 'covid19-dycovid.html',
})
export class Covid19DycovidPage {
  public descricao = `O Dycovid - Dynamic Contact Tracing é uma solução que realiza contact tracing de forma digital e anônima 
    a partir de um aplicativo instalado no celular dos cidadãos. Ele permite identificar o fluxo de contaminação 
    do Covid-19, mapeando de forma automatizada como o vírus está passando de pessoa para pessoa.`;
  
  private dycovidAppleId = 'id1512311758';
  private urlPeCidadaoPlayStore = 'https://play.google.com/store/apps/details?id=com.mobile.dycovid';
  private iosStore = `https://apps.apple.com/br/app/dycovid/${this.dycovidAppleId}`;
  private dycovidPackageName = 'com.mobile.dycovid';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _app: App, 
    private socialSharing: SocialSharing,
    private market: Market,
    private platform: Platform) {
  }

  openDycovid() {
    if(this.platform.is('android'))
      this.market.open(this.dycovidPackageName);
    else
      this.market.open(this.dycovidAppleId);
  }

  sharePlayStore() {
    //Common sharing event will open all available application to share
    const opts = {
      message: `PE Cidadão - Dycovid. Google Play: ${this.urlPeCidadaoPlayStore} , e App Store: ${this.iosStore}`,
      subject: 'Dycovid'
    };
    this.socialSharing
      .shareWithOptions(opts)
      .then((entries) => {
        console.log('success ' + JSON.stringify(entries));
      })
      .catch((error) => {
        console.error('error ' + JSON.stringify(error));
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Covid19DycovidPage');
  }

}
