import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Plant } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) {}

  getMenuItems() {
    return this.http.get<any>('/assets/route.json');
  }

  getPlants() {
    return this.http.get<Plant>(environment.api + '/plantas');
  }
}
