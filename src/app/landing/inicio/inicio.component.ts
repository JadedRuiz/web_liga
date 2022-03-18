import { Component, OnInit } from '@angular/core';
import { RegistroService } from 'src/app/services/registro.service';
import { RolJuegosService } from 'src/app/services/roljuegos.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

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
  categoria = "";
  temporadaID = 22;
  roljuegoID = 0;
  jornadaID = 269;
  jornada_vista = "";

  constructor(
    private roljuegos_service : RolJuegosService,
    private registro_service : RegistroService
    ) { }

  ngOnInit(): void {
    this.obtenerJornadaActual();
    this.obtenerCatalogoTemporadas();
    this.buscarJornadas();
    this.recuperarPremios();
    //this.buscarJuegosFiltro();
    this.obtenerCategorias();
    this.buscarPartidos(this.categoriaID, this.jornadaID);
    this.recuperaTablaPosiciones();
  }

  obtenerJornadaActual(){
    this.roljuegos_service.obtenerJornadaActivo()
    .subscribe((object : any) => {
      if(object.ok){
        this.temporadaID = object.data[0].TemporadaID;
        this.jornadaID = object.data[0].JornadaID;
        this.jornada_vista = object.data[0].Jornada_Vista;
      }else{
        this.jornada_vista = object.message;
      }
    })
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
      { titulo_amarillo : "MEJOR", titulo : "ENTRENADOR", fecha : "NOVIEMBRE 2021", foto_copa : "http://127.0.0.1/api_liga/storage/anuncios/anuncio-1.jpg"},
      { titulo_amarillo : "MEJOR", titulo : "JUGADOR", fecha : "NOVIEMBRE 2021", foto_copa : "http://127.0.0.1/api_liga/storage/anuncios/anuncio-2.jpg"},
      { titulo_amarillo : "CAMPEON", titulo : "", fecha : "NOVIEMBRE 2021", foto_copa : "http://127.0.0.1/api_liga/storage/anuncios/anuncio-3.jpg"}
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
    this.buscarPartidos(catID, this.jornadaID);
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

  seleccionarJornadas(jornadaID:number){
    this.buscarPartidos(this.categoriaID, jornadaID);
    this.Jornadas = [];
    this.roljuegos_service.obtenerJornadas()
    .subscribe((object : any) => {
      if(object.ok){
        this.Jornadas = object.data;
      }
    });
  }

  buscarPartidos(busCategoriaID:number,busJornadaID:number){
    let json = {
      JornadaID : busJornadaID,
      CategoriaID : busCategoriaID
    };
    this.lastesdGames = [];
    this.roljuegos_service.obtenerResultados(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.lastesdGames = object.data;
        this.categoria = object.data[0].categoria;
        this.categoriaID = busCategoriaID;
        
        
      }
    });
  }
}
