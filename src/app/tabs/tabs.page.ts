import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor() {}

  logout() {
    // Verificar se está rodando em um navegador ou em um dispositivo
    if (window.location) {
      console.log('Você está rodando em um navegador');
      window.close();
    } else {
      console.log('Você está rodando em um dispositivo');
    }
  }

}
