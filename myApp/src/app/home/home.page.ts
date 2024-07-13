import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMapsService } from '../services/google-maps.service';
import { SearchButtonComponent } from '../search-button/search-button.component'; 

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  map: any;

  constructor(private googleMapsService: GoogleMapsService) {}

  async ngOnInit() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.googleMapsService.getApiKey().subscribe((response) => {
      this.loadMap(coordinates.coords.latitude, coordinates.coords.longitude, response.apiKey);
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
}
