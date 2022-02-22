import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { RegistroService } from '../services/registro.service';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegistroComponent implements OnInit {

  categorias : any;
  json = {
    recibo : "",
    extension : "",
    equipo : "",
    CategoriaID : 0,
    curp : "",
    apellido_p : "",
    apellido_m : "",
    nombres : "",
    telefono : "",
    correo : "",
    usuario : "",
    contra : ""
  };
  @ViewChild('modal_camera', {static: false}) modalCamera : any;
  camera : any;
  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  constructor(
    private modal_service : NgbModal,
    private registro_service : RegistroService
  ) { }

  ngOnInit(): void {
    this.mostrarCategorias();
  }

  mostrarCategorias(){
    this.categorias = [];
    this.registro_service.catalogoCategorias()
    .subscribe((object : any) => {
      if(object.ok){
        this.categorias = object.data;
      }
    });
  }
  enviar(){
    if(this.json.recibo != ""){
      this.confirmar("Confirmación","¿Estas seguro de enviar la inscripción?","info",1);
    }else{
      Swal.fire("Ha ocurrido un error","No se puede enviar una solicitud sin recibo de pago","error");
    }
  }
  convertirImagenAB64(fileInput : any){
    return new Promise(function(resolve, reject) {
      let b64 = "";
      const reader = new FileReader();
      reader.readAsDataURL(fileInput);
      reader.onload = (e: any) => {
          b64 = e.target.result.split("base64,")[1];
          resolve(b64);
      };
    });
  }

  cambiarImagen(event: any){
    if (event.target.files && event.target.files[0]) {
      let archivos = event.target.files[0];
      let extension = archivos.name.split(".")[1];
      if(extension == "jpg" || extension == "png"){
        this.convertirImagenAB64(archivos).then( respuesta => {
          this.json.recibo = respuesta+"";
          this.json.extension = extension;
        });
      }else{
        Swal.fire("Ha ocurrido un error","Tipo de imagen no permitida","error");
      }
    }
  }
  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number){
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
        if(tipo == 1){  //enviar
          this.registro_service.enviar(this.json)
          .subscribe((object : any) => {
            if(object.ok){
              this.limpiarCampos();
              Swal.fire("Buen trabajo","La solicitud se ha enviado con exito","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
      }
    });
  }
  limpiarCampos(){
    this.json = {
      recibo : "",
      extension : "",
      equipo : "",
      CategoriaID : 0,
      curp : "",
      apellido_p : "",
      apellido_m : "",
      nombres : "",
      telefono : "",
      correo : "",
      usuario : "",
      contra : ""
    };
  }
  tomarFoto(){
    this.camera = this.modal_service.open(this.modalCamera, { scrollable: true, size: 'md', centered: true, backdrop: 'static', keyboard: false });
  }
  takeSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage) {
    this.getPicture.emit(webcamImage);
    let url_foto = webcamImage.imageAsDataUrl;
    let docB64 = url_foto.split(",");
    this.json.recibo = docB64[1];
    this.json.extension = "jpeg";
    this.camera.close();
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
