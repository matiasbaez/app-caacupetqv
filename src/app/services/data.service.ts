import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Plant } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private token;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    console.log('service constructor');
    this.storage.get('token').then(token => {
      this.token = token;
    }).catch(error => {
      console.log('service token error: ', error);
    });
  }

  getMenuItems() {
    return this.http.get<any>('/assets/route.json');
  }

  login(data) {
    return this.http.post(environment.api + '/login', data);
  }

  getProfile() {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + this.token);
    return this.http.get<any>(environment.api + '/user', {headers});
  }

  getPlants() {
    return this.http.get<Plant>(environment.api + '/plantas');
  }
}
