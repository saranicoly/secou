import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service'; // Ajuste o caminho conforme necessário
import { GoogleMap, MapDirectionsService } from '@angular/google-maps';
import { Router, ActivatedRoute } from '@angular/router';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { FloodService } from '../services/flood.service';

interface MarkerProperties {
  position: { lat: number, lng: number },
  label: { color: string, text: string },
  info: string,
  icon: any
};

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  @ViewChild(GoogleMap) map: GoogleMap;
  showPopup: boolean = true;
  ruaAtual!: string;
  proximoPasso!: any;
  proximaRuaList: string[] = [];
  proximaRua!: string;
  receivedData: any;
  center!: google.maps.LatLngLiteral;
  zoom: number = 15;
  directionsRenderer: google.maps.DirectionsResult;
  active: boolean;
  flag: boolean; //flag que indica que o redirecionamento veio da pagina 1 (isso indica que o mapa vai ter que ser refeito e a rota calculada)
  mapVisible:boolean = true;
  markers: MarkerProperties[] = [];
  selectedMarkerInfo = '';

  constructor(private dataService: DataService, private route: ActivatedRoute, private floodService : FloodService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.receivedData = this.dataService.getData();
      this.ruaAtual = this.receivedData[1][0]['legs'][0]['start_address'].split(',')[0];
      this.proximoPasso = this.receivedData[1][0]['legs'][0]['steps'][1];
      this.proximaRuaList = this.extractTextsBetweenTags(this.proximoPasso.html_instructions, 'b');
      this,this.proximaRua = this.proximaRuaList[1];
      this.flag = this.dataService.getFlag();
      this.dataService.setFlag(false); //Seta a flag que indica que o fluxo veio da pagina 1 como falso
      this.center = this.dataService.getCenter();
      console.log("Dados recebidos da tab1: ", this.receivedData);
      
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
    this.markers = [] //Reinicializa os marcadores
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

  openInfoWindow(marker:any, infoWindow: any) {
    window.alert("Informacoes sobre o ponto de alagamento")
  }

  async calculateAndDisplayRoute(): Promise<void> {
    await this.refreshMap(); //Recarrega um novo mapa
    console.log(this.ruaAtual);
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(this.map.googleMap!);

    //IMPLEMENTACAO DOS WAYPOINTS PARA GARANTIR QUE A ROTA NO FRONT PASSE PELOS PONTOS DA ROTA DO BACK
    
    let waypoints = [];
    
    const stepsList = this.receivedData[1][0]['legs'][0]['steps'];
    const streetsGeolocation = this.receivedData[2]
    const streetsFloodStatus = this.receivedData[0]
    
    //Faz a requisicao da rota (O TravelMode deve ser o mesmo usado no back) usando o start_location e o end_location da rota do back
    directionsService.route(
      {
        origin: this.receivedData[1][0]['legs'][0]['start_location'],
        destination: this.receivedData[1][0]['legs'][0]['end_location'],
        //waypoints: waypoints,
        travelMode: google.maps.TravelMode.WALKING
      },
      (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );

    //IMPLEMENTAÇÃO DOS MARCADORES
    const image = '..\\..\\assets\\floaded_point.png'
    for (const street of Object.keys(streetsGeolocation)) {
      if (streetsFloodStatus[street]) {
        this.markers.push({
          position: streetsGeolocation[street],
          label: { color: streetsFloodStatus[street]?'blue':'green', text: `Marker ${this.markers.length+1}` },
          info: `Marker ${this.markers.length+1} - Street ${street}`,
          icon: image
        });
      }
    };

  }

  selectLevel(level: number) {
    this.showPopup = false;
    const payload = { street: this.ruaAtual, level: level };
    this.floodService.sendFlood(payload).subscribe(response => {
    console.log('Response:', response);
    }, error => {
    console.error('Error:', error);
    });
  }

  extractTextsBetweenTags(html: string, tag: string): string[] {
    const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, 'g');
    const matches: string[] = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
      matches.push(match[1]);
    }

    return matches;
  }
}
