import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service'; // Ajuste o caminho conforme necessário

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  receivedData: any;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.receivedData = this.dataService.getData();
    console.log("Dados recebidos da tab1: ", this.receivedData);
  }
}
