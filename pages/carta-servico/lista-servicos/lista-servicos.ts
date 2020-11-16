import {
    Component,
    Input,
    EventEmitter,
    Output,
} from "@angular/core";
import { Servico } from "../../../providers/carta-servico-provider";
import { getThemeColor } from "../../../util/common";

@Component({
    selector: 'cmp-lista-servicos',
    templateUrl: './lista-servicos.html'
})
export class ListaServicosComponent {

    @Input() titulo: string;
    @Input() servicos: Servico[];

    @Output() clickServico: EventEmitter<Servico> = new EventEmitter<Servico>();
    @Output() clickWWWServico: EventEmitter<Servico> = new EventEmitter<Servico>();

    onClickServico(servico: Servico) {
        this.clickServico.emit(servico);
    }

    onClickWWWServico(servico: Servico) {
        this.clickWWWServico.emit(servico);
    }

    getIcon(servico: Servico): string {
        if (servico.listaTemaServico.length) {
            if (
                servico.listaTemaServico[0].temaServico.icone === '' ||
                servico.listaTemaServico[0].temaServico.icone == null
            ) {
                return 'fa-shield';
            }
            return servico.listaTemaServico[0].temaServico.icone;
        }
        return 'fa-shield';
    }

    getColor = (servico: Servico): string => {
        const themeId = servico.listaTemaServico.length > 0 ? servico.listaTemaServico[0].id : 0;
        return getThemeColor(themeId);
    }

}