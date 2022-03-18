import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarousel, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { InicioService } from 'src/app/services/inicio.service';
import { LoginService } from 'src/app/services/login.service';
import { RegistroService } from 'src/app/services/registro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  Imagedata : any; 
  Partidos : any;
  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;
  @ViewChild('contentLogin', {static : true}) modal_login: any;
  @ViewChild('modalReg', {static : true}) modal_registro: any;
  modal_close_login : any;
  modal_close_registro : any;
  //Varaibles modal login
  login = {
    usuario : "",
    contra : ""
  };
  correo = "";
  info = {
    nombre : "",
    telefono : "",
    equipo : "",
    correo : "",
    usuario_id : 0
  };
  //Variables modal registro
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
  @ViewChild('recuperar',{}) modal;
  mostrarInfo = true;
  tipo = 0;
  modal_obj : any;
  coincidencias : any;
  temporadaa = "";

  constructor(
    private modalService: NgbModal,
    private login_service : LoginService,
    private inicio_service : InicioService,
    private router : Router,
    private registro_service : RegistroService
    ) { }

  ngOnInit(): void {
    this.recuperarImagenes();
  }

  getTemporadaActual(){
    this.login_service.temporadaActual()
    .subscribe((object : any) => {
      if(object.ok){
        this.temporadaa = object.data;
      }else{
        this.temporadaa = object.message;
      }
    })
  }

  recuperarImagenes(){
    this.Imagedata = [
      `https://apiliga.reydelosdeportes.com.mx/storage/carousel/sidebar-1.jpg`,
      `https://apiliga.reydelosdeportes.com.mx/storage/carousel/sidebar-2.jpg`,
      `https://apiliga.reydelosdeportes.com.mx/storage/carousel/sidebar-3.jpg`,
      `https://apiliga.reydelosdeportes.com.mx/storage/carousel/sidebar-4.jpg`
    ];
  }

  recuperarRol(){
    this.Partidos = [
      { match : "", fecha : ""},
      { match : "", fecha : ""}
      //{ match : "MARIN FORCE VS SHICHIBUKAI", fecha : "FEB 13, 2022"}
    ]
  }

  next(){
    this.carousel.next();
  }
  
  prev(){
    this.carousel.prev();
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

  Login(){
    this.registro_service.login(this.login)
    .subscribe((object : any) => {
      if(object.ok){
        window.sessionStorage.setItem("Perfil",object.data[0].tipo);
        if(object.data[0].tipo != "admin"){
          window.sessionStorage.setItem("InscripcionID",object.data[0].InscripcionID);
          window.sessionStorage.setItem("UsuarioID",object.data[0].UsuarioID);
          this.router.navigate(['/ligayucatan/inicio']);
        }else{
          this.router.navigate(['/ligayucatan/inscripcion']);
        }
        this.closeModal(1);
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    })
  }

  recuperarContra(){
    this.coincidencias = [];
    this.registro_service.recuperarContra({correo : this.correo})
    .subscribe((object : any) => {
      if(object.ok){
        if(object.data.tipo == 1){
          this.mostrarInfo = false;
          this.tipo = 1;
          this.info.usuario_id = object.data.data[0].UsuarioID;
          this.info.nombre = object.data.data[0].nombre;
          this.info.equipo = object.data.data[0].Equipo;
          this.info.telefono = object.data.data[0].TelRep;
          this.info.correo = object.data.data[0].MailRep;
        }else{
          if(object.data.tipo == 2){
            this.mostrarInfo = false;
            this.tipo = 2;
            this.coincidencias = object.data.data;
          }else{
            this.mostrarInfo = false;
            Swal.fire("Ha ocurrido un error","No hemos encontrado ningun usaurio en está temporada con el correo proporcionado","error");
          }
        }
        
      }
    });
  }
  
  enviarContra(dato : any){
    if(dato == 0){
      dato = this.info.usuario_id;
    }
    this.confirmar("Confirmación","¿Sus datos concuerdan con el correo asociado?","info",2, dato);
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
        if(tipo == 1){  //enviar
          this.registro_service.enviar(this.json)
          .subscribe((object : any) => {
            if(object.ok){
              this.limpiarCamposRegistro();
              this.closeModal(2);
              Swal.fire("Buen trabajo","La solicitud se ha enviado con exito","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
        if(tipo == 2){  //Recuperar contra
          this.registro_service.enviarContra(dato)
          .subscribe((object : any) => {
            if(object.ok){
              this.formatear();
              Swal.fire("Buen trabajo",object.data,"success");
            }
          });
        }
      }
    });
  }

  formatear(){
    this.mostrarInfo = true;
    this.tipo = 0;
    this.correo = "";
    this.info = {
      nombre : "",
      telefono : "",
      equipo : "",
      correo : "",
      usuario_id : 0
    };
  }

  limpiarCamposRegistro(){
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
    this.camera = this.modalService.open(this.modalCamera, { scrollable: true, size: 'md', centered: true, backdrop: 'static', keyboard: false });
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

  openModal(tipo : any) {
    
    if(tipo == 1){
      console.log(tipo);
      this.modal_close_login = this.modalService.open(this.modal_login,{ size: 'md', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 2){
      console.log(tipo);
      this.modal_close_registro = this.modalService.open(this.modal_registro,{ size: 'md', centered : true, backdropClass : 'light-blue-backdrop'});
    }
  }

  closeModal(tipo : any){
    if(tipo == 1){
      this.modal_close_login.close();
    }
    if(tipo == 2){
      this.modal_close_registro.close();
    }
  }
}
