import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HouseStateModel} from './models/house-state.model';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  private readonly _httpClient: HttpClient = inject(HttpClient);

  houseState? : HouseStateModel;

  constructor() {
    // à l'initialisation on va chercher la derniere temperature
    this._httpClient.get<HouseStateModel>(environment.api + '/api/housestate').subscribe(
      (result) => {
        this.houseState  = result;
      }
    );
    // à chaque modification de la temperature mettre à jour la temperature
    const hubConnection = 
      new HubConnectionBuilder()
        .withUrl(environment.api + '/ws/house')
        .build();
    hubConnection.start().then(() => {
      hubConnection.on('newState', (state) => this.houseState = state)
    })
  }

  toggleLight() {
    this._httpClient.post<void>(environment.api + '/api/housestate', null).subscribe(
      () => {
        console.log("House state changed");
      }
    );
  }
}
