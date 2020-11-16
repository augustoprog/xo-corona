import { IonicPage } from "ionic-angular";
import { Component } from "@angular/core";
import {
    ThemeableBrowser,
    ThemeableBrowserOptions,
} from "@ionic-native/themeable-browser";

interface ExternalService {
    name: string;
    shortName: string;
    url: string;
    icon: string;
}

@IonicPage()
@Component({
  selector: "page-ouvidoria",
  templateUrl: "ouvidoria.html"
})
export class OuvidoriaPage {

    public services: ExternalService[] = [
        {
            name: 'Cadastro do cidadão no Módulo do Cidadão',
            shortName: 'Cadastro do cidadão',
            url: 'http://200.238.112.13:8080/ModuloCidadao/cadastro_cidadao.xhtml',
            icon: 'clipboard'
        },
        {
            name: 'Entrada de manifestações',
            shortName: 'Entrada de manifestações',
            url: 'http://200.238.112.13:8080/ModuloCidadao/atendimento_edit.xhtml',
            icon: 'plus'
        },
        {
            name: 'Acompanhar andamento com protocolo e senha',
            shortName: 'Acompanhar andamento',
            url: 'http://200.238.112.13:8080/ModuloCidadao/atendimento_list.xhtml',
            icon: 'barcode'
        },
        {
            name: 'Entrada de Pedidos de acesso à informação',
            shortName: 'Pedidos de acesso à informação',
            url: 'http://200.238.112.13:8080/ModuloCidadao/pai_edit.xhtml',
            icon: 'info'
        },
        {
            name: 'Consulta Pública de Pedidos de Acesso a Informação',
            shortName: 'Consulta Pública',
            url: 'http://200.238.112.13:8080/ModuloCidadao/pai_search.xhtml',
            icon: 'search'
        },
        {
            name: 'Área de Login do Cidadão para acompanhar seus pleitos',
            shortName: 'Área de Login do Cidadão',
            url: 'http://200.238.112.13:8080/ModuloCidadao/login_cidadao.xhtml',
            icon: 'lock'
        }
    ];

    constructor(private browser: ThemeableBrowser) { }

    openService(service: ExternalService) {
        const options: ThemeableBrowserOptions = {
            title: {
                color: '#ffffffff',
                staticText: service.shortName
            },
            toolbar: {
                color: '#3a9eeaff',
                height: 56
            },
            closeButton: {
                wwwImage: 'assets/images/close.png',
                align: 'left',
                event: 'closePressed'
            }
        };
        const page = this.browser.create(service.url, '_self', options);
        page.on('closePressed').subscribe(() => {
            page.close();
        });
    }

}