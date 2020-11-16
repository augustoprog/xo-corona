import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { environment } from "../../environment";

@Injectable()
export class UsuarioCadastroService {
  //coresRacas: any;

  constructor(public http: Http) {}

  getCorRaca(): Observable<any> {
    return this.http
      .get(environment.autoCadastro + "cor-raca" + environment.apikeyCadPublico)
      .map(res => res.json());
  }

  getNivelInstrucao(): Observable<any> {
    return this.http
      .get(
        environment.autoCadastro +
          "nivel-instrucao" +
          environment.apikeyCadPublico
      )
      .map(res => res.json());
  }

  getOcupacao(): Observable<any> {
    return this.http
      .get(environment.autoCadastro + "ocupacao" + environment.apikeyCadPublico)
      .map(res => res.json());
  }

  getOcupacaoByText(texto: string): Observable<any> {
    ///auto-cadastro/ocupacao/findByTitulo/{titulo}
    return this.http
      .get(
        environment.autoCadastro +
          "ocupacao/findByTitulo/" +
          texto +
          environment.apikeyCadPublico
      )
      .map(res => res.json());
  }

  getUf(): Observable<any> {
    return this.http
      .get(
        environment.autoCadastro +
          "endereco/getListaUF" +
          environment.apikeyCadPublico
      )
      .map(res => res.json());
  }

  getMunicipio(uf: string): Observable<any> {
    return this.http
      .get(
        environment.autoCadastro +
          "endereco/getMunicipiosPorUF/" +
          uf +
          environment.apikeyCadPublico
      )
      .map(res => res.json());
  }
}
