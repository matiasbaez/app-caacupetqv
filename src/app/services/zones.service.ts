import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { Zone } from '../interfaces/interfaces';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ZonesService {

  page = 0;
  newZone: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getZones(pull: boolean = false) {
    if (pull) { this.page = 0; }
    this.page++;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.userService.token}`);
    return this.http.get<Zone>(`${API}/zonas?page=${this.page}`, {headers});
  }

  searchByName(name: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.userService.token}`);
    const params = new HttpParams().append('name', name);
    return this.http.get<Zone>(`${API}/search/zonas`, { headers, params });
  }

  addZone(data: Zone) {
    return new Promise(resolve => {
      const headers = new HttpHeaders().append('Authorization', `Bearer ${this.userService.token}`);
      this.http.post(`${API}/zonas`, data, { headers }).subscribe(
        async (response: any) => {
          if (response.success) {
            this.newZone.emit(response.zona);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (error) => {
          console.log('Error: ', error);
          resolve(false);
        }
      );
    });
  }

  updateZone(data: Zone) {
    return new Promise(resolve => {
      const headers = new HttpHeaders().append('Authorization', `Bearer ${this.userService.token}`);
      this.http.put(`${API}/zonas/${data.idZona}`, data, { headers }).subscribe(
        async (response: any) => {
          console.log('response: ', response);
          if (response.success) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (error) => {
          console.log('Error: ', error);
          resolve(false);
        }
      );
    });
  }

  deleteZone(id) {
    return new Promise(resolve => {
      const headers = new HttpHeaders().append('Authorization', `Bearer ${this.userService.token}`);
      this.http.delete(`${API}/zonas/${id}`, { headers }).subscribe(
        async (response: any) => {
          console.log('response: ', response);
          if (response.success) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (error) => {
          console.log('Error: ', error);
          resolve(false);
        }
      );
    });
  }
}
