import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { JugadoresService } from 'src/app/services/jugadores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-jugadores-admin',
  templateUrl: './jugadores-admin.component.html',
  styleUrls: ['./jugadores-admin.component.css']
})
export class JugadoresAdminComponent implements OnInit {

  jugadores_busqueda = [];
  displayedColumns: string[] = ['Id', 'Nombre', "Fecha", 'TelPadre', 'TelMadre'];
  jugadores  = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator : any;
  @ViewChild('content',{}) modal;
  @ViewChild('equipos',{}) modalEquipo;
  modal_control_equipo : any;
  modal_control_jugador : any;
  myControl = new FormControl();
  foto : any;
  band_btn = true;
  jugador = {
    JugadorId : 0,
    curp : "",
    apellido_p : "",
    apellido_m : "",
    nombre : "",
    fecha_nacimiento : "",
    sexo : "-1",
    edad : "",
    equipo : "",
    correo : "",
    telefono : "",
    calle : "",
    cruzamiento_uno : "",
    cruzamiento_dos : "",
    num_exterior : "",
    num_int : "",
    colonia : "",
    municipio : "",
    estado : "",
    cp : "",
    nota : "",
    apellido_m_rep : "",
    apellido_p_rep : "",
    nombre_rep : "",
    tel_rep : "",
    correo_rep : "",
    apellido_pp : "",
    apellido_mp : "",
    nombre_p : "",
    apellido_pm : "",
    apellido_mm : "",
    nombre_m : "",
    telefono_p : "",
    telefono_m : "",
    foto_jugador : "",
    extension : "",
  };
  tipoModal = 0;
  jugador_seleccionado = 0;
  @ViewChild('modal_camera', {static: false}) modalCamera : any;
  camera : any;
  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  busqueda_equipo = "";
  equipos_bus: any;
  equipos_busqueda : any;

  constructor(
    private jugador_service : JugadoresService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal
  ) { 
    this.foto = "../assets/logos/avatar.jpg";
  }

  ngOnInit(): void {
    this.mostrarJugadores();
    this.mostrarEquipos();
  }

  mostrarJugadores(){
    this.jugadores.data = [];
    this.jugador_service.obtenerJugadoresAdmin()
    .subscribe((object : any) =>{
      if(object.ok){
        this.jugadores.data = object.data;
        this.jugadores.paginator = this.paginator;
      }
    });
  }

  mostrarEquipos(){
    this.equipos_bus = [];
    this.equipos_busqueda = [];
    this.jugador_service.obtenerEquipos()
    .subscribe((object : any) => {
      if(object.ok){
        this.equipos_bus = object.data;
        this.equipos_busqueda = object.data;
      }
    });
  }

  visualizar(id : any){
    this.jugador_service.obtenerJugadorPorId(id)
    .subscribe((object : any) => {
      if(object.ok){
        this.foto = object.data.Fotografia;
        this.jugador_seleccionado = id;
        this.jugador.JugadorId = object.data.JugadorID;
        this.jugador.nombre = object.data.Nombre;
        this.jugador.apellido_p = object.data.ApellidoPaterno;
        this.jugador.apellido_m = object.data.ApellidoMaterno;
        this.jugador.telefono = object.data.Telefono;
        this.jugador.sexo = object.data.Sexo;
        this.jugador.edad = object.data.Edad;
        this.jugador.curp = object.data.Curp;
        this.jugador.equipo = object.data.Equipo;
        if(object.data.Equipo == "AUN NO CUENTA CON EQUIPO ESTA TEMPORADA"){
          this.band_btn = true;
        }else{
          this.band_btn = false;
        }
        this.jugador.nombre_p = object.data.NPadre;
        this.jugador.apellido_pp = object.data.APPadre;
        this.jugador.apellido_mp = object.data.AMPadre;
        this.jugador.nombre_m = object.data.NMadre;
        this.jugador.apellido_pm = object.data.APMadre;
        this.jugador.apellido_mm = object.data.AMMadre;
        this.jugador.telefono_p = object.data.TelPadre;
        this.jugador.telefono_m = object.data.TelMadre;
        this.jugador.calle = object.data.Calle;
        this.jugador.num_exterior = object.data.Num_ext;
        this.jugador.cruzamiento_uno = object.data.Cruzamiento_uno;
        this.jugador.cruzamiento_dos = object.data.Cruzamiento_dos;
        this.jugador.colonia = object.data.Colonia;
        this.jugador.municipio = object.data.Municipio;
        this.jugador.nombre_rep = object.data.NRepresentante;
        this.jugador.apellido_p_rep = object.data.APRepresentante;
        this.jugador.apellido_m_rep = object.data.AMRepresentante;
      }
    });
  }

  busqueda(){
    if(this.myControl.value.length < 3){
      this.mostrarJugadores();
    }
    if(this.myControl.value.length > 3){
      this.jugadores.data = [];
      let json = {
        busqueda : this.myControl.value,
      };
      this.jugador_service.busquedaJugadores(json)
      .subscribe((object : any) =>{
        if(object.ok){
          this.jugadores.data = object.data;
          this.jugadores.paginator = this.paginator;
        }
      });
    }
    
  }

  buscarEquipo(){
    this.equipos_bus = [];
    this.equipos_busqueda.forEach((element : any) => {
      this.equipos_bus.push({
        "Equipo" : element.Equipo,
        "InscripcionID" : element.InscripcionID
      });
    });
    if(this.busqueda_equipo.length > 0){
      this.equipos_bus = [];
      this.equipos_busqueda.forEach((element : any) => {
        if(element.Equipo.includes(this.busqueda_equipo.toUpperCase())){ 
          this.equipos_bus.push({
            "Equipo" : element.Equipo,
            "InscripcionID" : element.InscripcionID
          })
        }
      });
    }
  }

  nuevoUsuario(){
    this.limpiarCampos();
    this.tipoModal = 1;
    this.openModal(1);
  }

  editar(){
    this.tipoModal = 2;
    this.openModal(1);
  }

  altaJugador(){
    this.confirmar("Confirmación","¿Seguro que deseas dar de alta/modificar al empleado?","info",1, null);
  }

  nuevaAltaAEquipo(){
    this.openModal(2);
  }

  altaJugadorAEquipo(id : any){
    let json = {
      JugadorId : this.jugador_seleccionado,
      InscripcionID : id
    };
    this.confirmar("Confirmación","¿Seguro que deseas dar de alta al jugador a este equipo?","info",2, json);
  }

  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number, json : any){
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
        if(tipo == 1){  //alta
          this.jugador_service.altaJugadorAdmin(this.jugador)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo",object.data,"success");
              this.modal_control_jugador.close();
              this.limpiarCampos();
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
        if(tipo == 2){
          this.jugador_service.altaJugadorAEquipo(json)
          .subscribe((object : any) => {
            if(object.ok){
              this.limpiarCampos();
              this.cerrarModal();
              this.mostrarJugadores();
              Swal.fire("Buen trabajo",object.data,"success");
            }
          });
        }
      }
    });
  }

  openModal(tipo : any) {
    if(tipo == 1){
      this.modal_control_jugador = this.modalService.open(this.modal, {ariaLabelledBy: 'modal-basic-title', size : "lg", centered : true, backdrop: 'static', keyboard: false});
    }
    if(tipo == 2){
      this.modal_control_equipo = this.modalService.open(this.modalEquipo, {ariaLabelledBy: 'modal-basic-title', size : "lg", centered : true, backdrop: 'static', keyboard: false});
    }
  }

  cerrarModal(){
    this.modal_control_equipo.close();
  }

  limpiarCampos(){
    this.foto = "../assets/logos/avatar.jpg";
    this.jugador = {
      JugadorId : 0,
      curp : "",
      apellido_p : "",
      apellido_m : "",
      nombre : "",
      fecha_nacimiento : "",
      sexo : "-1",
      edad : "",
      equipo : "",
      correo : "",
      telefono : "",
      calle : "",
      cruzamiento_uno : "",
      cruzamiento_dos : "",
      num_exterior : "",
      num_int : "",
      colonia : "",
      municipio : "",
      estado : "",
      cp : "",
      nota : "",
      apellido_m_rep : "",
      apellido_p_rep : "",
      nombre_rep : "",
      tel_rep : "",
      correo_rep : "",
      apellido_pp : "",
      apellido_mp : "",
      nombre_p : "",
      apellido_pm : "",
      apellido_mm : "",
      nombre_m : "",
      telefono_p : "",
      telefono_m : "",
      foto_jugador : "",
      extension : "",
    };
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

  cambiarImagen(event: any | null = null){
    if(null){
      event.target.files[0] = "";
    }
    if (event.target.files && event.target.files[0]) {
      let archivos = event.target.files[0];
      let extension = archivos.name.split(".")[1];
      if(extension == "jpg" || extension == "png" || extension == "JPG" || extension == "PNG'"){
        this.convertirImagenAB64(archivos).then( respuesta => {
          let img = "data:image/"+extension+";base64, "+respuesta;
          this.foto = this.sanitizer.bypassSecurityTrustResourceUrl(img);
          this.jugador.foto_jugador = respuesta+"";
          this.jugador.extension = extension;
        });
      }else{
        Swal.fire("Ha ocurrido un error","Tipo de imagen no permitida","error");
      }
    }
  }

  tomarFoto(){
    this.camera = this.modalService.open(this.modalCamera, { scrollable: true, size: 'md', centered: true, backdrop: 'static', keyboard: false });
  }
  
  takeSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage) {
    this.getPicture.emit(webcamImage);
    this.foto = webcamImage.imageAsDataUrl;
    let url_foto = webcamImage.imageAsDataUrl;
    let docB64 = url_foto.split(",");
    this.jugador.foto_jugador = docB64[1];
    this.jugador.extension = "jpeg";
    this.camera.close();
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
