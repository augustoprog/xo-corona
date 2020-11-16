import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ExpressoUnidadePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-expresso-unidade',
  templateUrl: 'expresso-unidade.html',
})
export class ExpressoUnidadePage {

  unidade: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.unidade = navParams.get("unidade");
    //console.log('unidade: ', this.unidade);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ExpressoUnidadePage');
  }

}
