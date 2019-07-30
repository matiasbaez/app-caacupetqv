import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/interfaces';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  token: string = null;
  emmitter = new EventEmitter();
  private user: User = null;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private navCtrl: NavController,
    private googlePlus: GooglePlus
  ) {}

  login(data) {
    return new Promise(resolve => {
      this.http.post(`${API}/login`, data).subscribe(
        async (response: any) => {
          if (response.token) {
            await this.saveToken(response.token);
            this.emmitter.emit(this.user);
            resolve(true);
          } else {
            this.token = null;
            await this.storage.remove('token');
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

  googleLogin() {
    this.googlePlus.login({})
    .then(response => {
      console.log('response: ', response);
    })
    .catch(err => {
      console.log('Error: ', err);
    });
  }

  register(data) {
    return new Promise(resolve => {
      this.http.post(`${API}/register`, data).subscribe(
        async (response: any) => {
          if (response.token) {
            await this.saveToken(response.token);
            this.emmitter.emit(this.user);
            resolve(true);
          } else {
            this.token = null;
            await this.storage.remove('token');
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

  getUser() {
    if (!this.user.id) {
      this.validateToken();
    }
    return { ...this.user };
  }

  getUserList() {
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer' + this.token);
    return this.http.get<User>(`${API}/user/list`, {headers});
  }

  validateEmail(email: string) {
    return new Promise(resolve => {
      this.http.post(`${API}/validate/email`, {email}).subscribe(
        (response) => {
          if (response === 200) {
            resolve(false);
          } else if (response === 404) {
            resolve(true);
          }
        },
        (error) => {
          resolve(false);
        }
      );
    });
  }

  deleteUser(userId) {
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer' + this.token);
    return new Promise(resolve => {
      this.http.delete(`${API}/user/${userId}`, { headers }).subscribe(
        (response) => {
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

  async saveToken(token: string) {
    this.token = token;
    await this.storage.set('token', token);
    await this.validateToken();
  }

  async loadToken() {
    this.token = await this.storage.get('token') || null;
  }

  async validateToken(): Promise<boolean> {
    console.log('VALIDATE TOKEN');
    await this.loadToken();
    if (!this.token) {
      this.navCtrl.navigateRoot('/main/home');
      return Promise.resolve(false);
    }

    return new Promise<boolean>(resolve => {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token);
      this.http.get(`${API}/user`, { headers }).subscribe(
        (response: any) => {
          console.log('response: ', response);
          if (response.user) {
            this.user = response.user;
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  }
}
