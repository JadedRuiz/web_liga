import { Component, OnInit } from '@angular/core';
import { InicioService } from 'src/app/services/inicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  buzon = {
    nombre : "",
    correo : "",
    telefono : "",
    asunto : "",
    comentario : ""
  };

  constructor(
    private inicio_service : InicioService
    ) { }

  ngOnInit(): void {
  }

  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number, dato : any){
    Swal.fire({
      title: title,
      text: texto,
      icon: tipo_alert,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText : "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        if(tipo == 3){
          this.inicio_service.enviarCorreoBuzon(dato)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo","Se ha enviado el correo correoctamente","success");
              this.buzon = {
                nombre : "",
                correo : "",
                telefono : "",
                asunto : "",
                comentario : ""
              };
            }
          });
        }
      }
    });
  }

  enviarBuzonCorreo(){
    if(this.buzon.nombre == ""){
      Swal.fire("Aviso","El campo nombre es obligatorio","info");
      return "";
    }
    if(this.buzon.correo == ""){
      Swal.fire("Aviso","El campo correo es obligatorio","info");
      return "";
    }
    if(this.buzon.asunto == ""){
      Swal.fire("Aviso","El campo asunto es obligatorio","info");
      return "";
    }
    if(this.buzon.comentario == ""){
      Swal.fire("Aviso","El comentario es obligatorio","info");
      return "";
    }
    let json = {
      "mensaje" : "Se ha enviado una sugerencia con la siguiete información. Nombre : "+this.buzon.nombre.toUpperCase()+", Asunto : "+this.buzon.asunto.toUpperCase()+", Telefono : "+this.buzon.telefono+", Comentario : "+this.buzon.comentario
    }
    this.confirmar("Confirmación","¿Seguro que deseas enviar tu sugerencia?","info",3,json);
  }

}
