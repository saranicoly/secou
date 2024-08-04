import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  showSearchForm = false;
  saida!: string;
  destino!: string;
  horario!: string;

  constructor() {}

  toggleSearch() {
    this.showSearchForm = !this.showSearchForm;
  }

  onSearch() {
    console.log('Saída:', this.saida);
    console.log('Destino:', this.destino);
    console.log('Horário:', this.horario);
    // Adicione aqui a lógica para processar a busca
  }
}
