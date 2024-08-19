import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { AlertController } from '@ionic/angular';

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

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService,
    private alertController: AlertController
  ) {}

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

  async errorSearching() {
    const alert = await this.alertController.create({
      header: 'Rota não encontrada',
      message: 'A rota especificada não foi encontrada, tente novamente.',
      buttons: ['OK']
    });
  
    await alert.present();
  }
  onSearch() {
    const params = new HttpParams()
      .set('origin', this.saida)
      .set('destination', this.destino)

      if (this.horario) {
        params.set('time', this.horario.replace(':', ''));
      }

    this.http.post('https://secou-backend.onrender.com/get_route', null, { params })
      .subscribe(
        (response: any) => {
          console.log('Response from backend:', response);
          this.dataService.setData(response); // Salva os dados no serviço
          this.dataService.setFlag(true); //Seta a flag que indica que a navegacao para a tab2 vai ser realizada
          this.dataService.setCenter(this.center); //Salva a localizacao atual

          // Vai para a Tab2
          this.router.navigateByUrl('/tabs/tab2');
        },
        error => {
          console.error('Error sending request:', error);
          this.errorSearching();
        }
      );
  }
}
