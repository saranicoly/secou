import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMapsService } from '../services/google-maps.service';
import { SearchButtonComponent } from '../search-button/search-button.component'; 
import { SharedDataService } from '../services/shared-data.service';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  map: any;
  address: string = "";

  constructor(private googleMapsService: GoogleMapsService,
              private sharedDataService: SharedDataService
  ) {}

  async ngOnInit() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.googleMapsService.getApiKey().subscribe((response) => {
      this.loadMap(coordinates.coords.latitude, coordinates.coords.longitude, response.apiKey);
      this.getAddress(coordinates.coords.latitude, coordinates.coords.longitude, response.apiKey);
    });
  }

  loadMap(lat: number, lng: number, apiKey: string) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      const mapOptions = {
        center: { lat, lng },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };

      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        title: 'Minha Localização',
      });
    };
  }

  getAddress(lat: number, lng: number, apiKey: string) {
    this.googleMapsService.getAddress(lat, lng, apiKey).subscribe((response) => {
      if (response.results && response.results.length > 0) {
        this.address = response.results[0].formatted_address;
        console.log('Endereço:', this.address);
        this.sharedDataService.updateAddress(this.address); 
      } else {
        console.error('Não foi possível obter o endereço.');
      }
    });
  }
}