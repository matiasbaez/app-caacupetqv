import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from '../../environments/environment';
import { Publications } from '../interfaces/interfaces';
import { DataService } from './data.service';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  page = 0;

  constructor(
    private userService: UserService,
    private dataService: DataService,
    private http: HTTP
  ) { }

  getPublications(pull: boolean = false) {
    if (pull) { this.page = 0; }
    this.page++;
    this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
    return this.http.get(`${API}/publicaciones?page=${this.page}`, {}, {});
  }

  addPublication(data: Publications) {
    return new Promise(resolve => {
      this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
      this.http.post(`${API}/publicaciones`, data, {})
      .then(async (response: any) => {
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

  updatePublication(data: Publications) {
    return new Promise(resolve => {
      this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
      this.http.put(`${API}/publicaciones/${data.idPublicacion}`, data, {})
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

  deletePublication(id) {
    return new Promise(resolve => {
      this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
      this.http.delete(`${API}/publicaciones/${id}`, {}, {})
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
