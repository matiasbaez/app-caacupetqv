import { Injectable, EventEmitter } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NavController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { User, GoogleLogin, FacebookProfileResponse } from '../interfaces/interfaces';
import { environment } from '../../environments/environment';
import { DataService } from './data.service';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  page = 0;
  token: string = null;
  emmitter = new EventEmitter();
  accessType = ''; // email, fb, google
  private user: User = null;

  constructor(
    private http: HTTP,
    private storage: Storage,
    private navCtrl: NavController,
    private googlePlus: GooglePlus,
    private dataService: DataService,
    private fb: Facebook
  ) { }

  searchByName(name: string) {
    this.http.setHeader('*', 'Authorization', `Bearer ${this.token}`);
    return this.http.get(`${API}/search/usuarios`, { name }, {});
  }

  login(data) {
    return new Promise(resolve => {
      this.http.post(`${API}/login`, data, {})
      .then(async (response: any) => {
        console.log('response: ', response);
        if (response.status === 200) {
          const parse = this.dataService.parseData(response.data);
          this.accessType = 'email';
          await this.saveToken(parse.token);
          this.emmitter.emit(this.user);
          resolve(true);
        } else {
          this.token = null;
          await this.storage.remove('token');
          resolve(false);
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
        resolve(false);
      });
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
      this.http.post(`${API}/register`, data, {})
      .then(async (response: any) => {
        const parse = this.dataService.parseData(response.data);
        if (parse.success) {
          if (autoLogin) {
            await this.saveToken(parse.token);
            this.emmitter.emit(this.user);
            resolve(true);
          } else { resolve(true); }
        } else {
          this.token = null;
          await this.storage.remove('token');
          resolve(false);
        }
      })
      .catch((error) => {
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
    this.http.setHeader('*', 'Authorization', `Bearer ${this.token}`);
    return this.http.get(`${API}/user/list?page=${this.page}`, {}, {});
  }

  validateEmail(email: string) {
    return new Promise(resolve => {
      this.http.post(`${API}/validate/email`, { email }, {})
      .then(response => {
        if (response.data === '200') {
          resolve(false);
        } else if (response.data === '404') {
          resolve(true);
        }
      })
      .catch((error) => {
        resolve(false);
      });
    });
  }

  deleteUser(userId) {
    this.http.setHeader('*', 'Authorization', `Bearer ${this.token}`);
    return new Promise(resolve => {
      this.http.post(`${API}/user/${userId}`, {_method: 'DELETE'}, {})
      .then(response => {
        console.log('response: ', response);
        if (response.status === 200) {
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

    return Promise.resolve(true);
  }

  async facebookAccessStatus(): Promise<boolean> {
    const validToken = await this.redirectIfNotExistToken();
    if (!validToken) { return Promise.resolve(false); }

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
    const validToken = await this.redirectIfNotExistToken();
    if (!validToken) { return Promise.resolve(false); }

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
    const validToken = await this.redirectIfNotExistToken();
    if (!validToken) { return Promise.resolve(false); }

    return new Promise<boolean>(resolve => {
      this.http.setHeader('*', 'Authorization', `Bearer ${this.token}`);
      this.http.setDataSerializer('json');
      this.http.get(`${API}/user`, {}, {})
      .then((response: any) => {
        const parse = this.dataService.parseData(response.data);
        if (response.status === 200 && parse.user) {
          this.user = parse.user;
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  async providerLogout() {
    this.accessType = await this.storage.get('accessType');
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
    await this.storage.remove('token');
    await this.providerTokenValidation();
    await this.storage.remove('accessType');
    this.emmitter.emit(this.user);
    // this.navCtrl.navigateRoot('/main/home', {animated: true});
  }
}
