import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { Zone } from '../interfaces/interfaces';
import { DataService } from './data.service';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ZonesService {

  page = 0;

  constructor(
    private userService: UserService,
    private dataService: DataService,
    private http: HTTP
  ) { }

  getZones(pull: boolean = false) {
    if (pull) { this.page = 0; }
    this.page++;
    this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
    return this.http.get(`${API}/zonas?page=${this.page}`, {}, {});
  }

  searchByName(name: string) {
    this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
    return this.http.get(`${API}/search/zonas`, { name }, {});
  }

  addZone(data: Zone) {
    return new Promise(resolve => {
      this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
      this.http.post(`${API}/zonas`, data, {})
      .then(async (response: any) => {
        const parse = this.dataService.parseData(response.data);
        if (parse.success === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
        resolve(false);
      });
    });
  }

  updateZone(data: Zone) {
    return new Promise(resolve => {
      this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
      this.http.put(`${API}/zonas/${data.idZona}`, data, {})
      .then(async (response: any) => {
        console.log('response: ', response);
        const parse = this.dataService.parseData(response.data);
        if (parse.success) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
        resolve(false);
      });
    });
  }

  deleteZone(id) {
    return new Promise(resolve => {
      this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
      this.http.delete(`${API}/zonas/${id}`, {}, {})
      .then(async (response: any) => {
        console.log('response: ', response);
        const parse = this.dataService.parseData(response.data);
        if (parse.success) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
        resolve(false);
      });
    });
  }
}
