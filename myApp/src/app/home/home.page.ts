import { Component } from '@angular/core';
import { ApiService } from '../services/api.service'; // Importe o serviço que você criou

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  inputText!: string;
  responseText!: string;

  constructor(private backendService: ApiService) {}

  sendText() {
    this.backendService.getProcessedData(this.inputText).subscribe(
      (response) => {
        // Verifique se a resposta está no formato esperado e acesse a propriedade correta
        if (response && response.response) {
          this.responseText = response.response;
        } else {
          this.responseText = 'Resposta inesperada do servidor';
        }
      },
      (error) => {
        console.error('Erro ao enviar o texto:', error);
        this.responseText = 'Erro ao enviar o texto';
      }
    );
  }
}