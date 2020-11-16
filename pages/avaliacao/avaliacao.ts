import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Servico, CartaServicoProvider } from '../../providers/carta-servico-provider';
import { Avaliacao, AvaliacaoProvider, MelhoramentoAvaliacao } from '../../providers/avaliacao/avaliacao';

/**
 * Generated class for the AvaliacaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-avaliacao',
  templateUrl: 'avaliacao.html',
})
export class AvaliacaoPage {
  public loader;
  public titleAvaliacao: string = 'Avaliação do Serviço';
  public servico: Servico;
  public servicoID: number;
  public avaliacao: number = 0;
  public chkAtend: boolean = false;
  public chkFacilUso: boolean = false;
  public chkFacilAcesso: boolean = false;
  public chkRapidez: boolean = false;
  public chkInformacoes: boolean = false;
  public chkInstalacoes: boolean = false;
  public comentario: string = '';
  public avaliacaoObj: Avaliacao;
  public melhoramentos;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    private cartaServicoProvider: CartaServicoProvider,
    private avaliacaoProvider: AvaliacaoProvider,
    private toastCtrl: ToastController) {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.servicoID = navParams.get("id");
    this.getServico();
  }

  getServico() {
    this.cartaServicoProvider.getServico(this.servicoID)
      .subscribe((servico: Servico) => {
        if (!!servico) {

          this.servico = servico;
          this.servico.descricao = servico.descricao
            ? this.captalizeText(servico.descricao)
            : null;
          this.servico.requisitos = servico.requisitos
            ? this.captalizeText(servico.requisitos)
            : null;
          this.servico.tempoEntrega = servico.tempoEntrega;
        }

        this.setMelhoramentos();

        //unidade.unidadeAtendimento.listaHorariosFuncionamento
        //for each item in unidade.unidadeAtendimento.listaHorariosFuncionamento

        ////console.log('this.servico: ', this.servico);
        this.loader.dismiss();
      });
  }

  captalizeText(txt) {
    var t1 = txt.charAt(0);
    var t2 = txt.substring(1);
    var txtCaptalized = t1 + t2.toLowerCase();

    return txtCaptalized;
  }

  avaliar(avaliacao: number) {
    this.avaliacao = avaliacao;
  }

  retirarAvaliacao(avaliacao: number) {
    this.avaliacao = avaliacao - 1;
  }

  enviarAvaliacao() {
    this.avaliacaoObj = new Avaliacao();
    this.avaliacaoObj.servicoId = this.servico.id;
    this.avaliacaoObj.comentario = this.comentario;
    this.avaliacaoObj.notaServico = this.avaliacao;
    this.avaliacaoObj.anonimo = window.localStorage.getItem("tipoAcesso") == 'anonimo' ? 1 : 0;
    this.avaliacaoProvider.postAvaliacao(this.avaliacaoObj).subscribe((avaliacao) => {
      if (avaliacao.id) {
        let hasCheck = this.melhoramentos.filter(mel => {
          return mel.check === true;
        });
        if (hasCheck.length > 0) {
          this.melhoramentos.forEach(melhoramento => {
            if (melhoramento.check) {
              let mel: MelhoramentoAvaliacao = new MelhoramentoAvaliacao();
              mel.avaliacaoId = avaliacao.id;
              mel.melhoramentoId = melhoramento.id;
              this.avaliacaoProvider.postMelhoramento(mel).subscribe((melhoramentoAvaliacao) => {
                if (melhoramentoAvaliacao.id) {
                  let toast = this.toastCtrl.create({
                    message: "Obrigado pela sua avaliação!",
                    duration: 2000,
                    position: "middle"
                  });
                  toast.present(toast);
                  this.navCtrl.pop();
                }
              });
            }
          });
        } else {
          let toast = this.toastCtrl.create({
            message: "Obrigado pela sua avaliação!",
            duration: 2000,
            position: "middle"
          });
          toast.present(toast);
          this.navCtrl.pop();
        }
      }
    });
  }

  setMelhoramentos() {
    this.melhoramentos = [{ id: 1, nome: 'Atendimento', check: false, visible: true },
    { id: 2, nome: 'Facilidade de uso', check: false, visible: true },
    { id: 3, nome: 'Facilidade de acesso', check: false, visible: true },
    { id: 4, nome: 'Rapidez', check: false, visible: true },
    { id: 5, nome: 'Informações', check: false, visible: true },
    { id: 6, nome: 'Instalações Físicas', check: false, visible: !this.servico.flagTotalmenteOnline }];
  }

  marcarMelhoramento(melhoramento) {
    melhoramento.check = !melhoramento.check;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AvaliacaoPage');
  }

}
