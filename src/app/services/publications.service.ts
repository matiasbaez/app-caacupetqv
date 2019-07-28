import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { Publications } from '../interfaces/interfaces';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getPublications() {
    return this.http.get<Publications>(`${API}/publicaciones`);
  }

  addPublication(data: Publications) {
    return new Promise(resolve => {
      const headers = new HttpHeaders()
        .append('Authorization', 'Bearer ' + this.userService.token);
      this.http.post(`${API}/publicaciones`, data, { headers }).subscribe(
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

  updatePublication(data: Publications) {
    return new Promise(resolve => {
      const headers = new HttpHeaders()
        .append('Authorization', 'Bearer ' + this.userService.token);
      this.http.put(`${API}/publicaciones/${data.idPlublicacion}`, data, { headers }).subscribe(
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

  deletePublication(id) {
    return new Promise(resolve => {
      const headers = new HttpHeaders()
        .append('Authorization', 'Bearer ' + this.userService.token);
      this.http.delete(`${API}/publicaciones/${id}`, { headers }).subscribe(
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
