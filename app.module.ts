import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { AppVersion } from "@ionic-native/app-version";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { CallNumber } from "@ionic-native/call-number";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Market } from '@ionic-native/market';
import { Camera } from "@ionic-native/camera";
import { Device } from "@ionic-native/device";
import { Diagnostic } from "@ionic-native/diagnostic";
import { File } from "@ionic-native/file";
import { FileOpener } from "@ionic-native/file-opener";
import { Geolocation } from "@ionic-native/geolocation";
import { Keyboard } from "@ionic-native/keyboard";
import { Network } from "@ionic-native/network";
import { Sim } from "@ionic-native/sim";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { ThemeableBrowser } from "@ionic-native/themeable-browser";
import { TextMaskModule } from "angular2-text-mask";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { AlertModule } from "ngx-bootstrap/alert";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { SelectBoxComponent } from "../components/select-box/select-box";
import { KeycloakInterceptor, KeycloakService } from "../keycloak";
import { AgendamentoComprovantePage } from "../pages/agendamento/agendamento-comprovante/agendamento-comprovante";
import { AgendamentoComprovantePageModule } from "../pages/agendamento/agendamento-comprovante/agendamento-comprovante.module";
import { AgendamentoConfirmarPage } from "../pages/agendamento/agendamento-confirmar/agendamento-confirmar";
import { AgendamentoConfirmarPageModule } from "../pages/agendamento/agendamento-confirmar/agendamento-confirmar.module";
import { AgendamentoConsultaPage } from "../pages/agendamento/agendamento-consulta/agendamento-consulta";
import { AgendamentoConsultaPageModule } from "../pages/agendamento/agendamento-consulta/agendamento-consulta.module";
import { AgendamentoDependentePage } from "../pages/agendamento/agendamento-dependente/agendamento-dependente";
import { AgendamentoDependentePageModule } from "../pages/agendamento/agendamento-dependente/agendamento-dependente.module";
import { AgendamentoStepFivePage } from "../pages/agendamento/agendamento-step-five/agendamento-step-five";
import { AgendamentoStepFivePageModule } from "../pages/agendamento/agendamento-step-five/agendamento-step-five.module";
import { AgendamentoStepFourPage } from "../pages/agendamento/agendamento-step-four/agendamento-step-four";
import { AgendamentoStepFourPageModule } from "../pages/agendamento/agendamento-step-four/agendamento-step-four.module";
import { AgendamentoStepOnePageConfirmation } from "../pages/agendamento/agendamento-step-one-confirmation/agendamento-step-one-confirmation";
import { AgendamentoStepOnePageConfirmationModule } from "../pages/agendamento/agendamento-step-one-confirmation/agendamento-step-one-confirmation.module";
import { AgendamentoStepOnePage } from "../pages/agendamento/agendamento-step-one/agendamento-step-one";
import { AgendamentoStepOnePageModule } from "../pages/agendamento/agendamento-step-one/agendamento-step-one.module";
import { AgendamentoStepThreePage } from "../pages/agendamento/agendamento-step-three/agendamento-step-three";
import { AgendamentoStepThreePageModule } from "../pages/agendamento/agendamento-step-three/agendamento-step-three.module";
import { AgendamentoStepTwoPage } from "../pages/agendamento/agendamento-step-two/agendamento-step-two";
import { AgendamentoStepTwoPageModule } from "../pages/agendamento/agendamento-step-two/agendamento-step-two.module";
import { AlertaCelularCadastroPage } from "../pages/alerta-celular-cadastro/alerta-celular-cadastro";
import { AlertaCelularCadastroPageModule } from "../pages/alerta-celular-cadastro/alerta-celular-cadastro.module";
import { AlertaCelularInformarPage } from "../pages/alerta-celular-informar/alerta-celular-informar";
import { AlertaCelularInformarPageModule } from "../pages/alerta-celular-informar/alerta-celular-informar.module";
import { CadastrarModule } from "../pages/cadastrar/cadastrar.module";
import { MenuServicosCartaResultModule } from "../pages/carta-servico/carta-servico-result/carta-servico-result.module";
import { MenuOrgaosCartaModule } from "../pages/carta-servico/menu-orgaos-carta/menu-orgaos-carta.module";
import { MenuServicosCartaModule } from "../pages/carta-servico/menu-servicos-carta/menu-servicos-carta.module";
import { MenuServicosDestaquePage } from "../pages/carta-servico/menu-servicos-destaque/menu-servicos-destaque";
import { MenuServicosDestaqueModule } from "../pages/carta-servico/menu-servicos-destaque/menu-servicos-destaque.module";
import { ServicoMapaPage } from "../pages/carta-servico/servico-mapa/servico-mapa";
import { ServicoMapaPageModule } from "../pages/carta-servico/servico-mapa/servico-mapa.module";
import { ComeceAgoraPage } from "../pages/comece-agora/comece-agora";
import { ComeceAgoraModule } from "../pages/comece-agora/comece-agora.module";
import { CompesaConsultaDebitoResultModule } from "../pages/compesa/compesa-consulta-debito-result/compesa-consulta-debito-result.module";
import { CompesaConsultaDebitoModule } from "../pages/compesa/compesa-consulta-debito/compesa-consulta-debito.module";
import { CompesaConsultaHistoricoContadorResultModule } from "../pages/compesa/compesa-consulta-historico-contador-result/compesa-consulta-historico-contador-result.module";
import { CompesaConsultaHistoricoContadorModule } from "../pages/compesa/compesa-consulta-historico-contador/compesa-consulta-historico-contador.module";
import { CompesaConsultaLojasPorMunicipioResultPageModule } from "../pages/compesa/compesa-consulta-lojas-por-municipio-result/compesa-consulta-lojas-por-municipio-result.module";
import { CompesaConsultaLojasPorMunicipioPageModule } from "../pages/compesa/compesa-consulta-lojas-por-municipio/compesa-consulta-lojas-por-municipio.module";
import { CompesaConsultaProtocoloResultPageModule } from "../pages/compesa/compesa-consulta-protocolo-result/compesa-consulta-protocolo-result.module";
import { CompesaConsultaProtocoloPageModule } from "../pages/compesa/compesa-consulta-protocolo/compesa-consulta-protocolo.module";
import { CtmLinhaItinerarioPageModule } from "../pages/ctm-linha-itinerario/ctm-linha-itinerario.module";
import { CtmListarLinhasPageModule } from "../pages/ctm-listar-linhas/ctm-listar-linhas.module";
import { CtmMapaParadasPageModule } from "../pages/ctm-mapa-paradas/ctm-mapa-paradas.module";
import { CtmParadaEstimativasPageModule } from "../pages/ctm-parada-estimativas/ctm-parada-estimativas.module";
import { DetranConsultaCnhResultModule } from "../pages/detran/detran-consulta-cnh-result/detran-consulta-cnh-result.module";
import { DetranConsultaCnhModule } from "../pages/detran/detran-consulta-cnh/detran-consulta-cnh.module";
import { DetranConsultaVeiculoResultModule } from "../pages/detran/detran-consulta-veiculo-result/detran-consulta-veiculo-result.module";
import { DetranConsultaVeiculoModule } from "../pages/detran/detran-consulta-veiculo/detran-consulta-veiculo.module";
import { EsqueciSenhaPage } from "../pages/esqueci-senha/esqueci-senha";
import { EsqueciSenhaPageModule } from "../pages/esqueci-senha/esqueci-senha.module";
import { ExpressoAntesDeIrPageModule } from "../pages/expresso-antes-de-ir/expresso-antes-de-ir.module";
import { ExpressoUnidadePageModule } from "../pages/expresso-unidade/expresso-unidade.module";
import { ExpressoUnidadesListarPageModule } from "../pages/expresso-unidades-listar/expresso-unidades-listar.module";
import { FaleConoscoPage } from "../pages/fale-conosco/fale-conosco";
import { FaleConoscoPageModule } from "../pages/fale-conosco/fale-conosco.module";
import { GovernoNoMapaPageModule } from "../pages/governo-no-mapa/governo-no-mapa.module";
import { InfoCadastrarModule } from "../pages/info-cadastrar/info-cadastrar.module";
import { AvaliacaoPageModule } from "../pages/avaliacao/avaliacao.module";
import { NotificacoesCidadaoPageModule } from '../pages/notificacoes-cidadao/notificacoes-cidadao.module';
import { NotificacaoDetalhePageModule } from '../pages/notificacao-detalhe/notificacao-detalhe.module';
import { ConfiguracoesModule } from '../pages/configuracoes/configuracoes.module';
import { TemaServicosAtivosProvider } from "../providers/tema-servicos-ativos/tema-servicos-ativos";
import { SQLite } from "@ionic-native/sqlite";
import { Push } from "@ionic-native/push";
import { LoginModule } from "../pages/login/login.module";
import { MenuAgendamentoPage } from "../pages/menu-agendamento/menu-agendamento";
import { MenuAgendamentoPageModule } from "../pages/menu-agendamento/menu-agendamento.module";
import { MenuAlertaCelularPage } from "../pages/menu-alerta-celular/menu-alerta-celular";
import { MenuAlertaCelularPageModule } from "../pages/menu-alerta-celular/menu-alerta-celular.module";
import { MenuCompesaModule } from "../pages/menu-compesa/menu-compesa.module";
import { MenuCtmPageModule } from "../pages/menu-ctm/menu-ctm.module";
import { MenuInformacaoPage } from "../pages/menu-informacao/menu-informacao";
import { MenuInformacaoModule } from "../pages/menu-informacao/menu-informacao.module";
import { MenuParticipePage } from "../pages/menu-participe/menu-participe";
import { MenuParticipeModule } from "../pages/menu-participe/menu-participe.module";
import { MenuRgDigitalPage } from "../pages/menu-rg-digital/menu-rg-digital";
import { MenuRgDigitalPageModule } from "../pages/menu-rg-digital/menu-rg-digital.module";
import { MenuServicoDetranModule } from "../pages/menu-servico-detran/menu-servico-detran.module";
import { MenuServicoPage } from "../pages/menu-servico/menu-servico";
import { MenuServicoModule } from "../pages/menu-servico/menu-servico.module";
import { ModalHorariosPage } from "../pages/modal-horarios/modal-horarios";
import { ModalHorariosPageModule } from "../pages/modal-horarios/modal-horarios.module";
import { ModalMunicipioPage } from "../pages/modal-municipio/modal-municipio";
import { ModalMunicipioPageModule } from "../pages/modal-municipio/modal-municipio.module";
import { ModalOcupacaoModule } from "../pages/modal-ocupacao/modal-ocupacao.module";
import { OuvidoriaPageModule } from "../pages/ouvidoria/ouvidoria.module";
import { PoliticaPageModule } from "../pages/politica/politica.module";
import { ProfileModule } from "../pages/profile/profile.module";
import { ChaveSegurancaPage } from "../pages/rg-digital/chave-seguranca/chave-seguranca";
import { ChaveSegurancaPageModule } from "../pages/rg-digital/chave-seguranca/chave-seguranca.module";
import { GerarQrCodePage } from "../pages/rg-digital/gerar-qr-code/gerar-qr-code";
import { GerarQrCodePageModule } from "../pages/rg-digital/gerar-qr-code/gerar-qr-code.module";
import { PinDesbloquearPageModule } from "../pages/rg-digital/pin-desbloquear/pin-desbloquear.module";
import { PinSegurancaPage } from "../pages/rg-digital/pin-seguranca/pin-seguranca";
import { PinSegurancaPageModule } from "../pages/rg-digital/pin-seguranca/pin-seguranca.module";
import { VisualizarRgPage } from "../pages/rg-digital/visualizar-rg/visualizar-rg";
import { VisualizarRgPageModule } from "../pages/rg-digital/visualizar-rg/visualizar-rg.module";
import { TabsPage } from "../pages/tabs/tabs";
import { UsuarioAlterarSenhaPageModule } from "../pages/usuario-alterar-senha/usuario-alterar-senha.module";
import { UsuarioCadastroModule } from "../pages/usuario-cadastro/usuario-cadastro.module";
import { UsuarioContatoEditarPageModule } from "../pages/usuario-contato-editar/usuario-contato-editar.module";
import { UsuarioContatoListaTiposPageModule } from "../pages/usuario-contato-lista-tipos/usuario-contato-lista-tipos.module";
import { UsuarioContatoModule } from "../pages/usuario-contato/usuario-contato.module";
import { UsuarioDocumentoEditarPageModule } from "../pages/usuario-documento-editar/usuario-documento-editar.module";
import { UsuarioDocumentoListaTiposPageModule } from "../pages/usuario-documento-lista-tipos/usuario-documento-lista-tipos.module";
import { UsuarioDocumentoPageModule } from "../pages/usuario-documento/usuario-documento.module";
import { UsuarioEnderecoEditarPageModule } from "../pages/usuario-endereco-editar/usuario-endereco-editar.module";
import { UsuarioEnderecoPageModule } from "../pages/usuario-endereco/usuario-endereco.module";
import { UsuarioFacilitadoresModule } from "../pages/usuario-facilitadores/usuario-facilitadores.module";
import { UsuarioPreferenciaModule } from "../pages/usuario-preferencia/usuario-preferencia.module";
import { UsuarioProgramaSocialPageModule } from "../pages/usuario-programa-social/usuario-programa-social.module";
import { AgendamentoProvider } from "../providers/agendamento/agendamento";
import { AlertProvider } from "../providers/alert/alert";
import { AlertaCelularProvider } from "../providers/alerta-celular/alerta-celular";
import { AppConfigProvider } from "../providers/app-config/app-config";
import { CadCidadaoProvider } from "../providers/cad-cidadao/cad-cidadao";
import { CepPostmonProvider } from "../providers/cep-postmon/cep-postmon";
import { CepProvider } from "../providers/cep/cep";
import { DetranProvider } from "../providers/detran-provider";
import { FaleConoscoProvider } from "../providers/fale-conosco/fale-conosco";
import { OpenStreetMapProvider } from "../providers/open-street-map/open-street-map";
import { RgProvider } from "../providers/rg/rg";
//import { IntroPage } from './../pages/intro/intro';
import { CadastrarPage } from "./../pages/cadastrar/cadastrar";
import { CartaServicoResultPage } from "./../pages/carta-servico/carta-servico-result/carta-servico-result";
import { MenuOrgaosCartaPage } from "./../pages/carta-servico/menu-orgaos-carta/menu-orgaos-carta";
import { MenuServicosCartaPage } from "./../pages/carta-servico/menu-servicos-carta/menu-servicos-carta";
import { CompesaConsultaDebitoResultPage } from "./../pages/compesa/compesa-consulta-debito-result/compesa-consulta-debito-result";
import { CompesaConsultaDebitoPage } from "./../pages/compesa/compesa-consulta-debito/compesa-consulta-debito";
import { CompesaConsultaHistoricoContadorResultPage } from "./../pages/compesa/compesa-consulta-historico-contador-result/compesa-consulta-historico-contador-result";
import { CompesaConsultaHistoricoContadorPage } from "./../pages/compesa/compesa-consulta-historico-contador/compesa-consulta-historico-contador";
import { CompesaConsultaLojasPorMunicipioResultPage } from "./../pages/compesa/compesa-consulta-lojas-por-municipio-result/compesa-consulta-lojas-por-municipio-result";
import { CompesaConsultaLojasPorMunicipioPage } from "./../pages/compesa/compesa-consulta-lojas-por-municipio/compesa-consulta-lojas-por-municipio";
import { CompesaConsultaProtocoloResultPage } from "./../pages/compesa/compesa-consulta-protocolo-result/compesa-consulta-protocolo-result";
import { CompesaConsultaProtocoloPage } from "./../pages/compesa/compesa-consulta-protocolo/compesa-consulta-protocolo";
import { CtmLinhaItinerarioPage } from "./../pages/ctm-linha-itinerario/ctm-linha-itinerario";
import { CtmListarLinhasPage } from "./../pages/ctm-listar-linhas/ctm-listar-linhas";
import { CtmMapaParadasPage } from "./../pages/ctm-mapa-paradas/ctm-mapa-paradas";
import { CtmParadaEstimativasPage } from "./../pages/ctm-parada-estimativas/ctm-parada-estimativas";
import { DetranConsultaCnhResultPage } from "./../pages/detran/detran-consulta-cnh-result/detran-consulta-cnh-result";
import { DetranConsultaCnhPage } from "./../pages/detran/detran-consulta-cnh/detran-consulta-cnh";
import { DetranConsultaVeiculoResultPage } from "./../pages/detran/detran-consulta-veiculo-result/detran-consulta-veiculo-result";
import { DetranConsultaVeiculoPage } from "./../pages/detran/detran-consulta-veiculo/detran-consulta-veiculo";
import { ExpressoAntesDeIrPage } from "./../pages/expresso-antes-de-ir/expresso-antes-de-ir";
import { ExpressoUnidadePage } from "./../pages/expresso-unidade/expresso-unidade";
import { ExpressoUnidadesListarPage } from "./../pages/expresso-unidades-listar/expresso-unidades-listar";
import { GovernoNoMapaPage } from "./../pages/governo-no-mapa/governo-no-mapa";
import { LoginPage } from "./../pages/login/login";
import { MenuCompesaPage } from "./../pages/menu-compesa/menu-compesa";
import { MenuCtmPage } from "./../pages/menu-ctm/menu-ctm";
import { MenuServicoDetranPage } from "./../pages/menu-servico-detran/menu-servico-detran";
import { AvaliacaoPage } from "./../pages/avaliacao/avaliacao";
import { NotificacoesCidadaoPage } from './../pages/notificacoes-cidadao/notificacoes-cidadao';
import { NotificacaoDetalhePage } from './../pages/notificacao-detalhe/notificacao-detalhe';
import { ConfiguracoesPage } from './../pages/configuracoes/configuracoes';
import { ModalOcupacaoPage } from "./../pages/modal-ocupacao/modal-ocupacao";
import { PoliticaPage } from "./../pages/politica/politica";
import { ProfilePage } from "./../pages/profile/profile";
import { UsuarioAlterarSenhaPage } from "./../pages/usuario-alterar-senha/usuario-alterar-senha";
import { UsuarioCadastroPage } from "./../pages/usuario-cadastro/usuario-cadastro";
import { UsuarioCadastroService } from "./../pages/usuario-cadastro/usuario-cadastro-service";
import { UsuarioContatoEditarPage } from "./../pages/usuario-contato-editar/usuario-contato-editar";
import { UsuarioContatoListaTiposPage } from "./../pages/usuario-contato-lista-tipos/usuario-contato-lista-tipos";
import { UsuarioContatoPage } from "./../pages/usuario-contato/usuario-contato";
import { UsuarioDocumentoEditarPage } from "./../pages/usuario-documento-editar/usuario-documento-editar";
import { UsuarioDocumentoListaTiposPage } from "./../pages/usuario-documento-lista-tipos/usuario-documento-lista-tipos";
import { UsuarioDocumentoPage } from "./../pages/usuario-documento/usuario-documento";
import { UsuarioEnderecoEditarPage } from "./../pages/usuario-endereco-editar/usuario-endereco-editar";
import { UsuarioEnderecoPage } from "./../pages/usuario-endereco/usuario-endereco";
import { UsuarioFacilitadoresPage } from "./../pages/usuario-facilitadores/usuario-facilitadores";
import { UsuarioPreferenciaPage } from "./../pages/usuario-preferencia/usuario-preferencia";
import { UsuarioProgramaSocialPage } from "./../pages/usuario-programa-social/usuario-programa-social";
import { CartaServicoProvider } from "./../providers/carta-servico-provider";
import { CompesaProvider } from "./../providers/compesa-provider";
import { CtmProvider } from "./../providers/ctm-provider";
import { BrMaskerModule } from "brmasker-ionic-3";
import { MyApp } from "./app.component";
import { NotificacaoProvider } from "../providers/notificacao/notificacao";
import { AvaliacaoProvider } from "../providers/avaliacao/avaliacao";
import { DatabaseProvider } from "../providers/database/database";
import { MenuCovid19Page } from "../pages/menu-covid19/menu-covid19";
import { MenuCovid19PageModule } from "../pages/menu-covid19/menu-covid19.module";
import { Covid19AtendeEmCasaPage } from "../pages/covid19-atende-em-casa/covid19-atende-em-casa";
import { Covid19AnjoAmigoPage } from "../pages/covid19-anjo-amigo/covid19-anjo-amigo";

import { Covid19DycovidPage } from "../pages/covid19-dycovid/covid19-dycovid";
import { Covid19AtendeEmCasaPageModule } from "../pages/covid19-atende-em-casa/covid19-atende-em-casa.module";
import { Covid19AnjoAmigoPageModule } from "../pages/covid19-anjo-amigo/covid19-anjo-amigo.module";

import { Covid19DycovidPageModule } from "../pages/covid19-dycovid/covid19-dycovid.module";
import { Covid19AtendeEmCasaInfoPage } from "../pages/covid19-atende-em-casa-info/covid19-atende-em-casa-info";
import { Covid19AtendeEmCasaInfoPageModule } from "../pages/covid19-atende-em-casa-info/covid19-atende-em-casa-info.module";

import { Covid19AnjoAmigoInfoPage } from "../pages/covid19-anjo-amigo-info/covid19-anjo-amigo-info";
import { Covid19AnjoAmigoInfoPageModule } from "../pages/covid19-anjo-amigo-info/covid19-anjo-amigo-info.module";
import { SefazNfePageModule } from "../pages/sefaz-nfe/sefaz-nfe.module";
import { ComprePEPageModule } from "../pages/compre-pe/compre-pe.module";
import { SefazNfePage } from "../pages/sefaz-nfe/sefaz-nfe";
import { SefazNfeConsultaPage } from "../pages/sefaz-nfe-consulta/sefaz-nfe-consulta";
import { SefazNfeResultadoPage } from "../pages/sefaz-nfe-resultado/sefaz-nfe-resultado";
import { SefazNfeConsultaPageModule } from "../pages/sefaz-nfe-consulta/sefaz-nfe-consulta.module";
import { SefazNfeResultadoPageModule } from "../pages/sefaz-nfe-resultado/sefaz-nfe-resultado.module";
import { SefazProvider } from "../providers/sefaz/sefaz-provider";

//import { IntroPage } from './../pages/intro/intro';

@NgModule({
  declarations: [MyApp, TabsPage],
  imports: [
    FormsModule,
    TextMaskModule,
    BrowserModule,
    HttpModule,
    LoginModule,
    MenuServicoModule,
    MenuServicoDetranModule,
    EsqueciSenhaPageModule,
    MenuInformacaoModule,
    MenuParticipeModule,
    ComeceAgoraModule,
    ProfileModule,
    UsuarioCadastroModule,
    UsuarioPreferenciaModule,
    UsuarioFacilitadoresModule,
    UsuarioContatoModule,
    DetranConsultaCnhModule,
    DetranConsultaCnhResultModule,
    DetranConsultaVeiculoModule,
    DetranConsultaVeiculoResultModule,
    MenuOrgaosCartaModule,
    MenuServicosDestaqueModule,
    MenuServicosCartaModule,
    MenuServicosCartaResultModule,
    MenuCompesaModule,
    CompesaConsultaDebitoModule,
    CompesaConsultaDebitoResultModule,
    CompesaConsultaHistoricoContadorModule,
    CompesaConsultaHistoricoContadorResultModule,
    CompesaConsultaLojasPorMunicipioPageModule,
    CompesaConsultaLojasPorMunicipioResultPageModule,
    CompesaConsultaProtocoloPageModule,
    CompesaConsultaProtocoloResultPageModule,
    MenuAlertaCelularPageModule,
    AlertaCelularCadastroPageModule,
    AlertaCelularInformarPageModule,
    ModalOcupacaoModule,
    ModalMunicipioPageModule,
    GovernoNoMapaPageModule,
    CadastrarModule,
    InfoCadastrarModule,
    MenuCtmPageModule,
    CtmLinhaItinerarioPageModule,
    CtmListarLinhasPageModule,
    CtmMapaParadasPageModule,
    CtmParadaEstimativasPageModule,
    ExpressoAntesDeIrPageModule,
    ExpressoUnidadePageModule,
    ExpressoUnidadesListarPageModule,
    UsuarioContatoListaTiposPageModule,
    UsuarioContatoEditarPageModule,
    UsuarioDocumentoEditarPageModule,
    UsuarioDocumentoListaTiposPageModule,
    UsuarioDocumentoPageModule,
    UsuarioProgramaSocialPageModule,
    UsuarioAlterarSenhaPageModule,
    UsuarioEnderecoPageModule,
    UsuarioEnderecoEditarPageModule,
    FaleConoscoPageModule,
    OuvidoriaPageModule,
    PoliticaPageModule,
    BrMaskerModule,
    ServicoMapaPageModule,
    AvaliacaoPageModule,
    NotificacoesCidadaoPageModule,
    NotificacaoDetalhePageModule,
    ConfiguracoesModule,
    HttpClientModule,
    MenuCovid19PageModule,
    Covid19AtendeEmCasaPageModule,
    Covid19AtendeEmCasaInfoPageModule,
    Covid19AnjoAmigoPageModule,
    Covid19AnjoAmigoInfoPageModule,
    
    Covid19DycovidPageModule,
    SefazNfePageModule,
    ComprePEPageModule,
    SefazNfeConsultaPageModule,
    SefazNfeResultadoPageModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: "",
      scrollAssist: true,
      autoFocusAssist: true
    }),
    AlertModule.forRoot(),
    MenuRgDigitalPageModule,
    PinSegurancaPageModule,
    ChaveSegurancaPageModule,
    GerarQrCodePageModule,
    VisualizarRgPageModule,
    NgxQRCodeModule,
    PinDesbloquearPageModule,
    AgendamentoComprovantePageModule,
    AgendamentoConsultaPageModule,
    AgendamentoConfirmarPageModule,
    AgendamentoDependentePageModule,
    AgendamentoStepFourPageModule,
    MenuAgendamentoPageModule,
    MenuServicosDestaqueModule,
    AgendamentoStepOnePageModule,
    AgendamentoStepOnePageConfirmationModule,
    AgendamentoStepTwoPageModule,
    AgendamentoStepThreePageModule,
    AgendamentoStepFourPageModule,
    AgendamentoStepFivePageModule,
    AgendamentoConfirmarPageModule,
    AgendamentoComprovantePageModule,
    ModalHorariosPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LoginPage,
    EsqueciSenhaPage,
    //IntroPage,
    MenuServicoPage,
    MenuInformacaoPage,
    MenuParticipePage,
    ComeceAgoraPage,
    CadastrarPage,
    ProfilePage,
    UsuarioCadastroPage,
    UsuarioPreferenciaPage,
    UsuarioFacilitadoresPage,
    ModalOcupacaoPage,
    ModalMunicipioPage,
    UsuarioContatoPage,
    MenuServicoDetranPage,
    DetranConsultaCnhPage,
    DetranConsultaCnhResultPage,
    DetranConsultaVeiculoPage,
    DetranConsultaVeiculoResultPage,
    MenuOrgaosCartaPage,
    MenuServicosCartaPage,
    CartaServicoResultPage,
    MenuCompesaPage,
    CompesaConsultaDebitoResultPage,
    CompesaConsultaDebitoPage,
    CompesaConsultaHistoricoContadorPage,
    CompesaConsultaHistoricoContadorResultPage,
    CompesaConsultaLojasPorMunicipioPage,
    CompesaConsultaLojasPorMunicipioResultPage,
    CompesaConsultaProtocoloPage,
    CompesaConsultaProtocoloResultPage,
    GovernoNoMapaPage,
    ServicoMapaPage,
    MenuCtmPage,
    CtmListarLinhasPage,
    CtmMapaParadasPage,
    CtmParadaEstimativasPage,
    CtmLinhaItinerarioPage,
    ExpressoAntesDeIrPage,
    ExpressoUnidadesListarPage,
    ExpressoUnidadePage,
    UsuarioContatoListaTiposPage,
    UsuarioContatoEditarPage,
    UsuarioDocumentoPage,
    UsuarioDocumentoEditarPage,
    UsuarioDocumentoListaTiposPage,
    UsuarioProgramaSocialPage,
    UsuarioAlterarSenhaPage,
    PoliticaPage,
    UsuarioEnderecoPage,
    UsuarioEnderecoEditarPage,
    FaleConoscoPage,
    SelectBoxComponent,
    MenuAlertaCelularPage,
    AlertaCelularCadastroPage,
    AlertaCelularInformarPage,
    AvaliacaoPage,
    NotificacoesCidadaoPage,
    NotificacaoDetalhePage,
    ConfiguracoesPage,
    MenuCovid19Page,
    Covid19AtendeEmCasaPage,
    Covid19AtendeEmCasaInfoPage,
    Covid19AnjoAmigoPage,
    Covid19AnjoAmigoInfoPage,
    
    Covid19DycovidPage,
    SefazNfePage,
    SefazNfeConsultaPage,
    SefazNfeResultadoPage,
    MenuRgDigitalPage,
    PinSegurancaPage,
    ChaveSegurancaPage,
    GerarQrCodePage,
    VisualizarRgPage,
    AgendamentoComprovantePage,
    AgendamentoConsultaPage,
    AgendamentoDependentePage,
    MenuServicosDestaquePage,
    MenuAgendamentoPage,
    AgendamentoStepOnePage,
    AgendamentoStepOnePageConfirmation,
    AgendamentoStepTwoPage,
    AgendamentoStepThreePage,
    AgendamentoStepFourPage,
    AgendamentoStepFivePage,
    AgendamentoConfirmarPage,
    AgendamentoComprovantePage,
    ModalHorariosPage
  ],
  providers: [
    StatusBar,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UsuarioCadastroService,
    DetranProvider,
    CartaServicoProvider,
    CompesaProvider,
    Network,
    SplashScreen,
    Geolocation,
    Diagnostic,
    OpenStreetMapProvider,
    CtmProvider,
    CadCidadaoProvider,
    AvaliacaoProvider,
    NotificacaoProvider,
    DatabaseProvider,
    SQLite,
    TemaServicosAtivosProvider,
    Camera,
    CepProvider,
    AppConfigProvider,
    CepPostmonProvider,
    AppVersion,
    FaleConoscoProvider,
    AlertProvider,
    AlertaCelularProvider,
    HttpClientModule,
    Sim,
    Keyboard,
    Device,
    BarcodeScanner,
    RgProvider,
    CallNumber,
    ThemeableBrowser,
    KeycloakService,
    Push,
    SocialSharing,
    Market,
    { provide: HTTP_INTERCEPTORS, useClass: KeycloakInterceptor, multi: true },
    AgendamentoProvider,
    File,
    FileOpener,
    SefazProvider
  ]
})
export class AppModule {}
