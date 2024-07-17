import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/get_rote.service';
import { SharedDataService } from '../services/shared-data.service';

@Component({
  selector: 'app-search-button',
  templateUrl: './search-button.component.html',
  styleUrls: ['./search-button.component.scss']
})
export class SearchButtonComponent implements OnInit{
  isExpanded = false;
  address: string = "";
  saidaInput!: string;
  destinoInput!: string;
  horaInput!: number;

  constructor(private apiService: ApiService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit() {
    this.sharedDataService.currentAddress.subscribe((address) => {
      this.address = address;
      console.log('Address:', this.address);

      if (!this.saidaInput) {
        this.saidaInput = this.address;
      }
    });
  }
  
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  sendRoute() {
    this.apiService.getRoute(this.saidaInput, this.destinoInput, this.horaInput).subscribe(response => {
      console.log('Response:', response);
    }, error => {
      console.error('Error:', error);
    });
  }
}
