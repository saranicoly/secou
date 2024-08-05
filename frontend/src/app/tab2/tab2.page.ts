import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../services/data.service'; 
import { FloodService } from '../services/flood.service'; 

declare const google: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, AfterViewInit {
  receivedData: any;
  showPopup: boolean = true;
  streetName!: string;
  map: any;
  geocoder: any;
  directionsService: any;
  directionsRenderer: any;
  waypoints: any[] = [];

  constructor(private dataService: DataService,
              private floodService: FloodService) {}

  ngOnInit() {
    this.receivedData = this.dataService.getData();
    console.log("Dados recebidos da tab1: ", this.receivedData);
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    const mapOptions = {
      center: { lat: -23.550520, lng: -46.633308 }, // Centro do mapa
      zoom: 12
    };

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
    this.geocoder = new google.maps.Geocoder();
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);

    this.addMarkers();
  }

  addMarkers() {
    const addresses = Object.keys(this.receivedData);
    const locations: google.maps.LatLng[] = [];
  
    addresses.forEach((address, index) => {
      if (this.receivedData[address] === false) {
        this.geocoder.geocode({ address: address }, (results: any, status: string) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            locations.push(location);
  
            new google.maps.Marker({
              position: location,
              map: this.map,
              title: address
            });
  
            // Define a rota depois de adicionar o último marcador
            if (index === addresses.length - 1) {
              this.drawRoute(locations);
            }
          } else {
            console.error(`Geocode was not successful for the address: ${address}. Reason: ${status}`);
          }
        });
      }
    });
  }

  drawRoute(locations: any[]) {
    if (locations.length < 2) return;

    const waypoints = locations.slice(1, -1).map(location => ({
      location: location,
      stopover: true
    }));

    const request = {
      origin: locations[0],
      destination: locations[locations.length - 1],
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result: any, status: string) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
      } else {
        console.error(`Directions request failed due to ${status}`);
      }
    });
  }

  selectLevel(level: number) {
    this.showPopup = false;
    console.log(`Nível selecionado: ${level}`);
    this.floodService.sendFlood(this.streetName, level).subscribe(response => {
      console.log('Response:', response);
    }, error => {
      console.error('Error:', error);
    });
  }
}
