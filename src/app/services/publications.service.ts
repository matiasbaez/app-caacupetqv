import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { Publications } from '../interfaces/interfaces';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  page = 0;
  newPublication: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getPublications(pull: boolean = false) {
    if (pull) { this.page = 0; }
    this.page++;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.userService.token}`);
    return this.http.get<Publications>(`${API}/publicaciones?page=${this.page}`, {headers});
  }

  searchBy(keyword: string) {
    const params = new HttpParams().append('keyword', keyword);
    return this.http.get<Publications>(`${API}/search/publicaciones`, { params });
  }

  addPublication(data: Publications) {
    data.idPlanta = data.planta.idPlanta;
    data.idZona = data.zona.idZona;
    return new Promise(resolve => {
      const headers = new HttpHeaders().append('Authorization', `Bearer ${this.userService.token}`);
      this.http.post(`${API}/publicaciones`, data, { headers }).subscribe(
        async (response: any) => {
          if (response.success) {
            this.newPublication.emit(response.publication);
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
    data.idPlanta = data.planta.idPlanta;
    data.idZona = data.zona.idZona;
    return new Promise(resolve => {
      const headers = new HttpHeaders().append('Authorization', `Bearer ${this.userService.token}`);
      this.http.put(`${API}/publicaciones/${data.idPublicacion}`, data, { headers }).subscribe(
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

  deletePublication(id) {
    return new Promise(resolve => {
      const headers = new HttpHeaders().append('Authorization', `Bearer ${this.userService.token}`);
      this.http.delete(`${API}/publicaciones/${id}`, { headers }).subscribe(
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
