import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reglas',
  templateUrl: './reglas.component.html',
  styleUrls: ['./reglas.component.css']
})
export class ReglasComponent implements OnInit {

  url  = "https://apiliga.reydelosdeportes.com.mx/storage/reglas/reglas.pdf";

  constructor() { }

  ngOnInit(): void {
  }

}
