import { Component, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbCarousel, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { data } from 'jquery';
import { RegistroService } from '../services/registro.service';
import { LoginService } from '../services/login.service';
import { RolJuegosService } from '../services/roljuegos.service';
import { InicioService } from '../services/inicio.service';
import { EventEmitter } from 'stream';
import { WebcamInitError } from 'ngx-webcam';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InicioComponent implements OnInit {

  Imagedata : any; 
  PremiosData : any;
  Partidos : any;
  Jornadas : any;
  Temporadas : any;
  Categorias : any;
  Fechas : any;
  TablaPosicion : any;
  lastesdGames : any;
  temporadaa = "";
  categoriaID = 4;
  temporadaID = 22;
  roljuegoID = 0;
  jornadaID = 269;
  jornada_vista = "";

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

  constructor(
    private modalService: NgbModal,
    private login_service : LoginService,
    private registro_service : RegistroService,
    private roljuegos_service : RolJuegosService,
    private router : Router
  ) {  }

  ngOnInit(): void {
    this.obtenerJornadaActual();
    this.getTemporadaActual();
    this.recuperarImagenes();
    this.recuperarPartidos();
    this.obtenerCatalogoTemporadas();
    this.buscarJornadas();
    this.recuperaTablaPosiciones();
    this.recuperarPremios();
    //this.buscarJuegosFiltro();
    this.obtenerCategorias();
    this.buscarPartidos();
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

  obtenerJornadaActual(){
    this.roljuegos_service.obtenerJornadaActivo()
    .subscribe((object : any) => {
      if(object.ok){
        this.temporadaID = object.data.TemporadaID;
        this.jornadaID = object.data.Representante;
        this.jornada_vista = object.data.Jornada_Vista;
      }else{
        this.jornada_vista = object.message;
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

  recuperarPartidos(){
    this.Partidos = [
      { match : "TOROS VS DIABLOS ROJOS", fecha : "ABR 15, 2022"},
      { match : "REAL FC VS LEONES", fecha : "MAR 22, 2022"},
      { match : "MARIN FORCE VS SHICHIBUKAI", fecha : "FEB 13, 2022"}
    ]
  }

  recuperaTablaPosiciones(){
    let json = {
      TemporadaID : this.temporadaID,
      CategoriaID : this.categoriaID
    };
    this.TablaPosicion = [];
    this.roljuegos_service.obtenerStanding(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.TablaPosicion = object.data;
      }
    });

    //this.TablaPosicion = [
    //  { position : 1, foto : "http://127.0.0.1/api_liga/storage/fotos/Equipos/Equipo-1.png", equipo : "SPORTLAND", wins : "153", loses : "30", points : "186"}
    //]
  }

  recuperarPremios(){
    this.PremiosData = [
      { titulo_amarillo : "MEJOR", titulo : "ENTRENADOR", fecha : "NOVIEMBRE 2021", foto_copa : "./assets/imagenes/copas/copa-2.png"},
      { titulo_amarillo : "MEJOR", titulo : "JUGADOR", fecha : "NOVIEMBRE 2021", foto_copa : "./assets/imagenes/copas/copa-2.png"},
      { titulo_amarillo : "CAMPEON", titulo : "", fecha : "NOVIEMBRE 2021", foto_copa : "./assets/imagenes/copas/copa-1.png"}
    ]
  }

  obtenerCatalogoTemporadas(){
    this.Temporadas = [
      { id : 1, temporada : "TORNEO DE VERANO 2022"},
      { id : 2, temporada : "TORNEO DE VERANO 2021"},
      { id : 3, temporada : "TORNEO DE VERANO 2020"},
    ]
  }

  obtenerCategorias(){
    this.Categorias = [];
    this.registro_service.catalogoCategorias()
    .subscribe((object : any) => {
      if(object.ok){
        this.Categorias = object.data;
      }
    });
  }
  mostrarCategoria(catID: number){
    this.categoriaID = catID;
    

    alert("Categoria " + catID);
  }
  
  buscarJornadas(){
    this.Jornadas = [];
    this.roljuegos_service.obtenerJornadas()
    .subscribe((object : any) => {
      if(object.ok){
        this.Jornadas = object.data;
      }
    });
  }

  buscarPartidos(){
    let json = {
      JornadaID : this.jornadaID,
      CategoriaID : this.categoriaID
    };
    this.lastesdGames = [];
    this.roljuegos_service.obtenerResultados(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.lastesdGames = object.data;
      }
    });
  }
  
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size : "md", centered : true, keyboard : false});
  }

  next(){
    this.carousel.next();
  }
  
  prev(){
    this.carousel.prev();
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
      this.confirmar("Confirmación","¿Estas seguro de enviar la inscripción?","info",1,null);
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
}
