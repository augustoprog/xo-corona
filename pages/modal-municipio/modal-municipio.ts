import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";

/**
 * Generated class for the ModalMunicipioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-modal-municipio",
  templateUrl: "modal-municipio.html"
})
export class ModalMunicipioPage {
  uf: any;
  municipios: any[];
  municipiosFull: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.uf = this.navParams.get("uf");
    this.municipios = this.navParams.get("municipios");
    this.municipiosFull = this.municipios;
    //console.log(this.municipiosFull);
  }

  getItems(ev) {
    // Reset items back to all of the items

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      //let filtro = val.toLowerCase();
      this.municipios = this.municipiosFull.filter(item => {
        return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else {
      this.municipios = this.municipiosFull;
    }
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
  setMunicipio(ocupacao) {
    this.viewCtrl.dismiss(ocupacao);
  }
}
