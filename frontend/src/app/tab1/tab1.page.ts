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

  private geocoder = new google.maps.Geocoder();

  constructor() {}

  ngOnInit() {
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        this.center = {
          lat: latitude,
          lng: longitude
        };

        this.reverseGeocode(latitude, longitude);
      }, (error) => {
        console.error('Error getting location', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  reverseGeocode(lat: number, lng: number) {
    const latLng = new google.maps.LatLng(lat, lng);
    
    this.geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        // Obtem o endereço formatado
        const address = results[0].formatted_address;
        this.saida = address;
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  toggleSearch() {
    this.showSearchForm = !this.showSearchForm;
  }

  onSearch() {
    console.log('Saída:', this.saida);
    console.log('Destino:', this.destino);
    console.log('Horário:', this.horario);
    // Adicionar aqui a lógica para processar a busca
  }
}
