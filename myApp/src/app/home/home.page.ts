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
  routeStreets:any;

  constructor(private googleMapsService: GoogleMapsService,
              private sharedDataService: SharedDataService
  ) {}

  async ngOnInit() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.googleMapsService.getApiKey().subscribe((response) => {
      this.loadMap(coordinates.coords.latitude, coordinates.coords.longitude, response.apiKey);
      this.getAddress(coordinates.coords.latitude, coordinates.coords.longitude, response.apiKey);
    });
    this.sharedDataService.routeStreets$.subscribe(routeStreets => {
      this.routeStreets = routeStreets;
      this.highlightRouteStreetsOnMap();
    })
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

      if (this.routeStreets) {
        this.highlightRouteStreetsOnMap();
      }
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

  highlightRouteStreetsOnMap(){
    if (!this.map) {
      return; // Mapa ainda não carregado
    }
    const geocoder = new google.maps.Geocoder();
    const directionsService = new google.maps.DirectionsService();
    const streets = Object.entries(this.routeStreets);
    console.log(this.routeStreets);

    const source = streets[0][0]
    const target = streets[8][0]
    var flag1 = false;
    var flag2 = false;
    const sourceLocation:any = '';
    const targetLocation:any = '';

    geocoder.geocode({ 'address': source }, (results:any, status:any) => {
      if (status === 'OK') {
        console.log(source,' status OK geocode');
        const sourceLocation = results[0].geometry.location;
        flag1 = true;
      } else {
        console.error('Geocode falhou: ' + status);
      }
    });

    geocoder.geocode({ 'address': target }, (results:any, status:any) => {
      if (status === 'OK') {
        console.log(target,' status OK geocode');
        const targetLocation = results[0].geometry.location;
        flag2 = true;
      } else {
        console.error('Geocode falhou: ' + status);
      }
    });


    const request = {
      origin: sourceLocation,
      destination: targetLocation, // Mesmo endereço como origem e destino
      travelMode: 'DRIVING', // Pode usar 'WALKING' se for mais adequado
    };
    
    const isFlooded = true;
    directionsService.route(request, (result:any, status:any) => {
      if (status === 'OK') {
        console.log(' status OK directionsService');
        const route = result.routes[0];
        const path = route.overview_path;
        const color = isFlooded ? 'red' : 'blue';
        console.log(path,' ===');
        new google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: color,
          strokeOpacity: 1.0,
          strokeWeight: 3,
          map: this.map,
        });
      } else {
        console.error('Directions request falhou: ' + status);
      }
    });
    /*streets.forEach(([street, isFlooded]) => {
      if(isFlooded){
        console.log(street,' is flooded');
      }else{
        console.log(street,' is not flooded');
      }
      geocoder.geocode({ 'address': street }, (results:any, status:any) => {
        if (status === 'OK') {
          console.log(street,' status OK geocode');
          const location = results[0].geometry.location;
          
          // Opções de direção para obter uma rota
          const request = {
            origin: location,
            destination: location, // Mesmo endereço como origem e destino
            travelMode: 'DRIVING', // Pode usar 'WALKING' se for mais adequado
          };
          
          directionsService.route(request, (result:any, status:any) => {
            if (status === 'OK') {
              console.log(street,' status OK directionsService');
              const route = result.routes[0];
              const path = route.overview_path;
              const color = isFlooded ? 'red' : 'blue';
              console.log(path,' ===');
              new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: color,
                strokeOpacity: 1.0,
                strokeWeight: 3,
                map: this.map,
              });
            } else {
              console.error('Directions request falhou: ' + status);
            }
          });
        } else {
          console.error('Geocode falhou: ' + status);
        }
      });
    });*/
    /*streets.forEach(([street, isFlooded]) => {
      
      if(isFlooded){
        console.log(street,' is flooded');
      }else{
        console.log(street,' is not flooded');
      }
      geocoder.geocode({ 'address': street }, (results: any, status: any) => {
        if (status === 'OK') {
          new google.maps.Marker({
            map: this.map,
            position: results[0].geometry.location,
            title: street
          });
        } else {
          console.error('Geocode falhou: ' + status);
        }
      });
    });*/
  }
}