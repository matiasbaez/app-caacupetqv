import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { UserService } from './user.service';
import { Role } from '../interfaces/interfaces';
import { environment } from '../../environments/environment';
import { DataService } from './data.service';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  page = 0;

  constructor(
    private userService: UserService,
    private dataService: DataService,
    private http: HTTP
  ) { }

  getRoles(pull: boolean = false) {
    if (pull) { this.page = 0; }
    this.page++;
    this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
    return this.http.get(`${API}/roles?page=${this.page}`, {}, {});
  }

  searchByName(name: string) {
    this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
    return this.http.get(`${API}/search/roles`, { name }, {});
  }

  addRole(data: Role) {
    return new Promise(resolve => {
      this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
      this.http.post(`${API}/roles`, data, {})
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

  updateRole(data: Role) {
    data['_method'] = 'PUT';
    return new Promise(resolve => {
      this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
      this.http.post(`${API}/roles/${data.idRole}`, data, {})
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

  deleteRole(id) {
    return new Promise(resolve => {
      this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
      this.http.post(`${API}/roles/${id}`, {_method: 'DELETE'}, {})
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
