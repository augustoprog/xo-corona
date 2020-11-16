import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Covid19AnjoAmigoPage } from '../covid19-anjo-amigo/covid19-anjo-amigo';

/**
 * Generated class for the Covid19AnjoAmigoInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-covid19-anjo-amigo-info',
  templateUrl: 'covid19-anjo-amigo-info.html',
})
export class Covid19AnjoAmigoInfoPage {
  public descricao = `A rede social Anjo Amigo é uma das plataformas selecionadas pelo Ministério Público 
    de Pernambuco e pela Secretaria de Saúde de Pernambuco, em parceria com o Porto Digital, 
    como parte de uma Arquitetura de Enfrentamento ao Covid-19, onde as principais funções do Estado, 
    na dimensão Saúde, estarão integradas. Anjo Amigo é uma rede colaborativa para conexão entre idosos (60+) 
    em isolamento social e profissionais de saúde, voluntários, empreendedores e órgãos governamentais.`;
  
  public url = 'https://www.anjoamigo.com';
  private urlPeCidadaoPlayStore = 'https://anjoamigo.com';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public _app: App, 
    private socialSharing: SocialSharing
  ) {
  }

  openAnjoAmigoPage() {
    this._app.getRootNav().push(Covid19AnjoAmigoPage);
  }

  sharePlayStore() {
    //Common sharing event will open all available application to share
    const opts = {
      message: `PE Cidadão - Anjo Amigo ${this.urlPeCidadaoPlayStore}`,
      subject: 'Anjo Amigo'
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
    console.log('ionViewDidLoad Covid19AnjoAmigoInfoPage');
  }

}
