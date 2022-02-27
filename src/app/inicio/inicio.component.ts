import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  Imagedata : any; 
  PremiosData : any;
  Partidos : any;
  Temporadas : any;
  Fechas : any;
  TablaPosicion : any;
  lastesdGames : any;
  temporadaa = "";
  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  constructor(
    private modalService: NgbModal,
    private login_service : LoginService,
  ) {  }

  ngOnInit(): void {
    this.getTemporadaActual();
    this.recuperarImagenes();
    this.recuperarPartidos();
    this.obtenerCatalogoTemporadas();
    this.buscarFechas(1);
    this.recuperaTablaPosiciones();
    this.recuperarPremios();
    this.buscarJuegosFiltro();
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
      `http://127.0.0.1/api_liga/storage/carousel/sidebar-1.jpg`,
      `http://127.0.0.1/api_liga/storage/carousel/sidebar-2.jpg`,
      `http://127.0.0.1/api_liga/storage/carousel/sidebar-3.jpg`,
      `http://127.0.0.1/api_liga/storage/carousel/sidebar-4.jpg`
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
    this.TablaPosicion = [
      { position : 1, foto : "http://127.0.0.1/api_liga/storage/fotos/Equipos/Equipo-1.png", equipo : "SPORTLAND", wins : "153", loses : "30", points : "186"},
      { position : 2, foto : "http://127.0.0.1/api_liga/storage/fotos/Equipos/Equipo-2.png", equipo : "DREAM TEAM", wins : "120", loses : "30", points : "186"},
      { position : 3, foto : "http://127.0.0.1/api_liga/storage/fotos/Equipos/Equipo-3.jpg", equipo : "REAL MADRID", wins : "100", loses : "30", points : "186"},
      { position : 4, foto : "http://127.0.0.1/api_liga/storage/fotos/Equipos/Equipo-4.jpg", equipo : "CELTA VIGO", wins : "98", loses : "30", points : "186"},
      { position : 5, foto : "http://127.0.0.1/api_liga/storage/fotos/Equipos/Equipo-5.jpg", equipo : "BARCELONA", wins : "98", loses : "30", points : "186"}
    ]
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

  buscarFechas(id : number){
    if(id == 1){
      this.Fechas = ["12/01/2022","15/01/2022","18/01/2022"];
    }
    if(id == 2){
      this.Fechas = ["22/02/2022","25/02/2022","28/02/2022"];
    }
    if(id == 3){
      this.Fechas = ["05/03/2022","05/03/2022","08/03/2022"];
    }
  }

  buscarJuegosFiltro(){
    this.lastesdGames = [
      { ubicacion : "NEW YORKERS STADIUM - APRIL 15, 2020", temporada : "TORNENO VERANO 2022",
        equipo_1 : {
          equipo : "SPORTLAND",
          logo : "http://127.0.0.1/api_liga/storage/fotos/Equipos/Equipo-1.png",
          carreras : 2,
          win : true
        },
        equipo_2 : {
          equipo : "DREAM TEAM",
          logo : "http://127.0.0.1/api_liga/storage/fotos/Equipos/Equipo-2.png",
          carreras : 1,
          win : false
        }
      },
      { ubicacion : "BAVARIA STADIUM - APRIL 15, 2020", temporada : "TORNENO VERANO 2022",
        equipo_1 : {
          equipo : "REAL MADRID",
          logo : "http://127.0.0.1/api_liga/storage/fotos/Equipos/Equipo-3.jpg",
          carreras : 2,
          win : true
        },
        equipo_2 : {
          equipo : "TOROS",
          logo : "http://127.0.0.1/api_liga/storage/fotos/Equipos/Equipo-4.jpg",
          carreras : 1,
          win : false
        }
      }
    ]
  }

  seleccionarTemporada(id : number){
    this.buscarFechas(id);
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
