import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service'; // Ajuste o caminho conforme necessário
import { GoogleMap, MapDirectionsService } from '@angular/google-maps';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  @ViewChild(GoogleMap) map: GoogleMap;

  receivedData: any;
  center!: google.maps.LatLngLiteral;
  zoom: number = 15;
  directionsRenderer: google.maps.DirectionsResult;
  active: boolean;
  flag: boolean;
  mapVisible:boolean = true;

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, private directionsService: MapDirectionsService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.receivedData = this.dataService.getData();
      this.flag = this.dataService.getFlag();
      this.dataService.setFlag(false);
      console.log("Dados recebidos da tab1: ", this.receivedData);
      this.center = {
        lat: -8.122056,
        lng: -34.970135
      };
      if (this.active && this.flag){
        this.calculateAndDisplayRoute();
      }
    });
    this.active = true;
  }

  ngAfterViewInit(): void {
    this.calculateAndDisplayRoute();
  }

  async refreshMap(): Promise<void> {
    this.mapVisible = false; 
    await this.delay(0);
    this.mapVisible = true;
    await this.delay(0);
  }
  
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  reduceWaypoints<T>(list: T[]): T[] {
    while (list.length > 24) {
      const randomIndex = Math.floor(Math.random() * list.length);
      list.splice(randomIndex, 1);
    }
    return list;
  }

  async calculateAndDisplayRoute(): Promise<void> {
    await this.refreshMap();
    
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(this.map.googleMap!);
    console.log(this.receivedData[1][0]['legs'][0]['start_location']);
    console.log(this.receivedData[1][0]['legs'][0]['end_location']);

    let waypoints = [];
    
    const stepsList = this.receivedData[1][0]['legs'][0]['steps'];
    for (const step of stepsList) {
      waypoints.push({
        location: step['end_location'],
        stopover: false
      });
    };
    
    /*interface MyDictionary {
      [key: string]: any;
    }

    const stepsList = Object.values(this.receivedData[2]);
    for (const step of stepsList) {
      const myStep = step as MyDictionary; 
      waypoints.push({
        location: { lat: myStep['lat'], lng: myStep['lng'] },//step,
        stopover: false
      });
    };
    console.log(waypoints);*/

    waypoints = this.reduceWaypoints(waypoints);
    console.log(waypoints);

    directionsService.route(
      {
        origin: this.receivedData[1][0]['legs'][0]['start_location'],
        destination: this.receivedData[1][0]['legs'][0]['end_location'],
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        console.log(`status ${status}`);
        console.log(`result ${result}`);
        console.log(`mapVisible ${this.mapVisible}`);
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }
}
