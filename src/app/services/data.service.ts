import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  parseData(data) {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error('JSON parsing error');
    }
    return data;
  }
}
