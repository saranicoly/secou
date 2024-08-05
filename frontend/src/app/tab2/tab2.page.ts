import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service'; 
import { FloodService } from '../services/flood.service'; 

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  receivedData: any;
  showPopup: boolean = true;
  streetName!: string;

  constructor(private dataService: DataService,
    private floodService: FloodService
  ) {}

  ngOnInit() {
    this.receivedData = this.dataService.getData();
    console.log("Dados recebidos da tab1: ", this.receivedData);
  }

  selectLevel(level: number) {
    this.showPopup = false;
    console.log(`Nível selecionado: ${level}`);
    this.floodService.sendFlood(this.streetName, level).subscribe(response => {
      console.log('Response:', response);
    }, error => {
      console.error('Error:', error);
    });
}}
