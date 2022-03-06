import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbCarousel, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { data } from 'jquery';
import { RegistroService } from '../services/registro.service';
import { LoginService } from '../services/login.service';
import { RolJuegosService } from '../services/roljuegos.service';
import { InicioService } from '../services/inicio.service';


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

  constructor(
    private modalService: NgbModal,
    private login_service : LoginService,
    private registro_service : RegistroService,
    private roljuegos_service : RolJuegosService
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
}
