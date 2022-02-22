import { Component, OnInit } from '@angular/core';
import { ReporteService } from 'src/app/services/reportes.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  constructor(
    private reporte_service : ReporteService
  ) { }

  ngOnInit(): void {
  }

  visualizar(tipo : number){
    let json = {
      datos : {
        opcion : tipo
      },
      nombre : "Equipos"
    };
    this.reporte_service.obtenerReporte(json)
    .subscribe((object : any) => {
      const win = window.open("","_blank");
      let html = '';
      html += '<html>';
      html += '<body style="margin:0!important">';
      html += '<embed width="100%" height="100%" src="data:application/pdf;base64,'+object.data+'" type="application/pdf" />';
      html += '</body>';
      html += '</html>';
      win.document.write(html);
    });
  }

  descargar(tipo : number){
    let json = {};
    let nombreReporte = "";
    if(tipo == 4){
      json = {
        datos : {},
        nombre : "Jugadores"
      };
      nombreReporte = "ListaJugadores.xlsx";
    }
    if(tipo == 1 || tipo == 2 || tipo == 3){
      json = {
        datos : {
          opcion : tipo
        },
        nombre : "Equipos"
      };
      nombreReporte = "ReporteEstado.pdf";
    }
    this.reporte_service.obtenerReporte(json)
    .subscribe((object : any) => {
      var arrayBuffer = this.base64ToArrayBuffer(object.data);
      var newBlob = new Blob([arrayBuffer], { type: "application/octet-stream" });
      var data = window.URL.createObjectURL(newBlob);
      let link  = document.createElement('a');
      link.href = data;
      link.download = nombreReporte;
      link.click();
    });
  }

  base64ToArrayBuffer(base64 : string) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }
}
