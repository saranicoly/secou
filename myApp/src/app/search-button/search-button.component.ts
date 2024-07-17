import { Component } from '@angular/core';
import { ApiService } from '../services/get_rote.service';

@Component({
  selector: 'app-search-button',
  templateUrl: './search-button.component.html',
  styleUrls: ['./search-button.component.scss']
})
export class SearchButtonComponent {
  isExpanded = false;
  saidaInput!: string;
  destinoInput!: string;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  constructor(private apiService: ApiService) {}

  sendRoute() {
    this.apiService.getRoute(this.saidaInput, this.destinoInput).subscribe(response => {
      console.log('Response:', response);
    }, error => {
      console.error('Error:', error);
    });
  }
}
