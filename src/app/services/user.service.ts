import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { environment } from '../../environments/environment';
import { User, GoogleLogin, FacebookProfileResponse } from '../interfaces/interfaces';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  page = 0;
  token: string = null;
  emmitter = new EventEmitter();
  accessType: string = ''; // email, fb, google
  private user: User = null;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private navCtrl: NavController,
    private googlePlus: GooglePlus,
    private fb: Facebook
  ) {}

  searchByName(name: string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
    const params = new HttpParams().append('name', name);
    return this.http.get<User>(`${API}/search/usuarios`, { headers, params });
  }

  login(data) {
    return new Promise(resolve => {
      this.http.post(`${API}/login`, data).subscribe(
        async (response: any) => {
          if (response.token) {
            this.accessType = 'email';
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
    return new Promise(resolve => {
      this.googlePlus.login({})
      .then(async (response: GoogleLogin) => {
        this.accessType = 'google';
        await this.saveToken(response.accessToken);
        this.emmitter.emit(this.user);
        resolve(true);
      })
      .catch(err => {
        console.log('Error: ', err);
        resolve(false);
      });
    });
  }

  facebookLogin() {
    return new Promise(resolve => {
      this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(async (response: FacebookLoginResponse) => {
        if (response.status === 'connected') {
          this.accessType = 'fb';
          await this.saveToken(response.authResponse.accessToken);
          this.emmitter.emit(this.user);
          resolve(true);
        } else {
          this.token = null;
          await this.storage.remove('token');
          resolve(false);
        }
      })
      .catch(e => {
        console.log('Error logging into Facebook', e);
        resolve(false);
      });
    });
  }

  register(data, autoLogin) {
    return new Promise(resolve => {
      this.http.post(`${API}/register`, data)
      .subscribe(async (response: any) => {
        if (response.token) {
          if (autoLogin) {
            await this.saveToken(response.token);
            this.emmitter.emit(this.user);
            resolve(true);
          } else { resolve(true); }
        } else {
          this.token = null;
          await this.storage.remove('token');
          resolve(false);
        }
      },
      (error) => {
        console.log('Error: ', error);
        resolve(false);
      });
    });
  }

  getUser() {
    if (!this.user.id) { this.validateToken(); }
    return { ...this.user };
  }

  getUserList(pull: boolean = false) {
    if (pull) { this.page = 0; }
    this.page++;
    const headers = new HttpHeaders().set('Authorization', 'Bearer' + this.token);
    return this.http.get<User>(`${API}/user/list?page=${this.page}`, {headers});
  }

  validateEmail(email: string) {
    return new Promise(resolve => {
      this.http.post(`${API}/validate/email`, {email})
      .subscribe(response => {
        if (response === 200) {
          resolve(false);
        } else if (response === 404) {
          resolve(true);
        }
      },
      (error) => {
        resolve(false);
      });
    });
  }

  deleteUser(userId) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer' + this.token);
    return new Promise(resolve => {
			this.http.delete(`${API}/user/${userId}`, { headers })
			.subscribe(response => {
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
      });
    });
  }

  async saveToken(token: string) {
    this.token = token;
    await this.storage.set('token', token);
    await this.storage.set('accessType', this.accessType);
    await this.providerTokenValidation();
  }

  async providerTokenValidation() {
    let access = false;
    this.accessType = await this.storage.get('accessType');
    console.log('accessType: ', this.accessType);
    if (this.accessType === 'email') { access = await this.validateToken(); }
    else if (this.accessType === 'fb') { access = await this.facebookAccessStatus(); }
    else if (this.accessType === 'google') { access = await this.googleAccessStatus(); }
    return access;
  }

  async loadToken() {
    this.token = await this.storage.get('token') || null;
  }

  async redirectIfNotExistToken() {
    await this.loadToken();
    if (!this.token) {
      this.navCtrl.navigateRoot('/main/home', { animated: true });
      return Promise.resolve(false);
    }
  }

  async facebookAccessStatus(): Promise<boolean> {
    await this.redirectIfNotExistToken();

    return new Promise<boolean>(resolve => {
      this.fb.getLoginStatus()
        .then(async (response: FacebookLoginResponse) => {
          if (response.status === 'connected') {
            await this.getFacebookProfileInfo();
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(err => {
          console.log('Error: ', err);
          resolve(false);
        });
    });
  }

  async getFacebookProfileInfo() {
    const profileData = `/me?fields=id,name,email,first_name,picture.width(1024).height(1024),last_name,gender`;
    await this.fb.api(profileData, ['public_profile', 'user_friends', 'email'])
      .then((response: FacebookProfileResponse) => {
        const imageUrl = (response.picture && response.picture.data) ? response.picture.data.url : '/assets/img/user.svg';
        this.user = {
          id: response.id,
          name: response.name,
          email: response.email,
          image: imageUrl,
          role: 'n',
          estado: 1
        };
      })
      .catch(err => console.log('Error: ', err));
  }

  async googleAccessStatus(): Promise<boolean> {
    await this.redirectIfNotExistToken();

    return new Promise<boolean>(resolve => {
      this.googlePlus.trySilentLogin({})
      .then(response => {
        console.log('response: ', response);
        this.user = {
          id: response.userId,
          name: response.displayName,
          email: response.email,
          image: (response.imageUrl) ? response.imageUrl : '/assets/img/user.svg',
          role: 'n',
          estado: 1
        };
        resolve(true);
      })
      .catch(err => {
        console.log('Error: ', err);
        resolve(false);
      });
    });
  }

  async validateToken(): Promise<boolean> {
    await this.redirectIfNotExistToken();

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

  async providerLogout() {
    if (this.accessType === 'email') { await this.logout(); }
    if (this.accessType === 'fb') { await this.facebookLogout(); }
    if (this.accessType === 'google') { await this.googleLogout(); }
  }

  facebookLogout() {
    this.fb.logout()
    .then(response => {
      console.log('response: ', response);
      this.logout();
    })
    .catch(err => console.log('Error: ', err));
  }

  googleLogout() {
    this.googlePlus.logout()
    .then(response => {
      console.log('response: ', response);
      this.logout();
    })
    .catch(err => console.log('Error: ', err));
  }

  async logout() {
    this.token = null;
    this.user = null;
    this.storage.clear();
    await this.providerTokenValidation();
    this.emmitter.emit(this.user);
    // this.navCtrl.navigateRoot('/main/home', {animated: true});
  }
}
