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

  page = 0;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getPublications(pull: boolean = false) {
    if (pull) { this.page = 0; }
    this.page++;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.userService.token);
    return this.http.get<Publications>(`${API}/publicaciones?page=${this.page}`, {headers});
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
      this.http.put(`${API}/publicaciones/${data.idPublicacion}`, data, { headers }).subscribe(
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
