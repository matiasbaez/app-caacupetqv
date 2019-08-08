import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserService } from './user.service';
import { Role } from '../interfaces/interfaces';
import { environment } from '../../environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  page = 0;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getRoles(pull: boolean = false) {
    if (pull) { this.page = 0; }
    this.page++;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.userService.token);
    return this.http.get<Role>(`${API}/roles?page=${this.page}`, {headers});
  }

  searchByName(name: string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.userService.token);
    const params = new HttpParams().append('name', name);
    return this.http.get<Role>(`${API}/search/roles`, { headers, params });
  }

  addRole(data: Role) {
    return new Promise(resolve => {
      const headers = new HttpHeaders()
        .append('Authorization', 'Bearer ' + this.userService.token);
      this.http.post(`${API}/roles`, data, {headers}).subscribe(
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

  updateRole(data: Role) {
    return new Promise(resolve => {
      const headers = new HttpHeaders()
        .append('Authorization', 'Bearer ' + this.userService.token);
      this.http.put(`${API}/roles/${data.idRole}`, data, { headers }).subscribe(
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

  deleteRole(id) {
    return new Promise(resolve => {
      const headers = new HttpHeaders()
        .append('Authorization', 'Bearer ' + this.userService.token);
      this.http.delete(`${API}/roles/${id}`, { headers }).subscribe(
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
