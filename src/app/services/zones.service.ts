import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { Zone } from '../interfaces/interfaces';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ZonesService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getZones() {
    return this.http.get<Zone>(`${API}/zonas`);
  }

  addZone(data: Zone) {
    return new Promise(resolve => {
      const headers = new HttpHeaders()
        .append('Authorization', 'Bearer ' + this.userService.token);
      this.http.post(`${API}/zonas`, data, { headers }).subscribe(
        async (response: any) => {
          if (response === 200) {
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
      const headers = new HttpHeaders()
        .append('Authorization', 'Bearer ' + this.userService.token);
      this.http.put(`${API}/zonas/${data.idZona}`, data, { headers }).subscribe(
        async (response: any) => {
          console.log('response: ', response);
          if (response === 200) {
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
      const headers = new HttpHeaders()
        .append('Authorization', 'Bearer ' + this.userService.token);
      this.http.delete(`${API}/zonas/${id}`, { headers }).subscribe(
        async (response: any) => {
          console.log('response: ', response);
          if (response === 200) {
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
