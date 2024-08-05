import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  showSearchForm = false;
  saida!: string;
  destino!: string;
  horario!: string;
  center!: google.maps.LatLngLiteral;
  zoom: number = 15;

  constructor() {}

  ngOnInit() {
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      }, (error) => {
        console.error('Error getting location', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  toggleSearch() {
    this.showSearchForm = !this.showSearchForm;
  }

  onSearch() {
    console.log('Saída:', this.saida);
    console.log('Destino:', this.destino);
    console.log('Horário:', this.horario);
    // Adicione aqui a lógica para processar a busca
  }
}
