import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  token: string = null;
  emmitter = new EventEmitter();
  private accessType: string = ''; // email, fb, google
  private user: User = null;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private navCtrl: NavController,
    private googlePlus: GooglePlus,
    private fb: Facebook
  ) {}

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
    this.googlePlus.login({})
    .then(async (response: GoogleLogin) => {
      console.log('response: ', response);
      this.accessType = 'google';
      await this.saveToken(response.accessToken);
    })
    .catch(err => {
      console.log('Error: ', err);
    });
  }

  facebookLogin() {
    return new Promise(resolve => {
      this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(async (response: FacebookLoginResponse) => {
        if (response.status === 'connected') {
          this.accessType = 'fb';
					await this.saveToken(response.authResponse.accessToken);
					console.log('user: ', this.user);
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

  async facebookAccessStatus() {
    await this.loadToken();
    if (!this.token) {
      this.navCtrl.navigateRoot('/main/home', { animated: true });
      return Promise.resolve(false);
    }

    return new Promise(resolve => {
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
    await this.fb.api(`/me?fields=id,name,email,first_name,picture,last_name,gender`, ['public_profile', 'user_friends', 'email'])
    .then((response: FacebookProfileResponse) => {
			console.log('response: ', response);
			this.user = {
				id: response.id,
				name: response.name,
				email: response.email,
				image: response.picture.data.url,
				role: 'n',
				password: '',
				estado: 1
			};
    })
    .catch(err => console.log('Error: ', err));
  }

  facebookLogout() {
    this.fb.logout()
    .then(response => console.log('response: ', response))
    .catch(err => console.log('Error: ', err));
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

  getUserList() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer' + this.token);
    return this.http.get<User>(`${API}/user/list`, {headers});
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
    if (this.accessType === 'email') { await this.validateToken(); }
    if (this.accessType === 'fb') { await this.facebookAccessStatus(); }
  }

  async loadToken() {
    this.token = await this.storage.get('token') || null;
  }

  async validateToken(): Promise<boolean> {
    console.log('VALIDATE TOKEN');
    await this.loadToken();
    if (!this.token) {
      this.navCtrl.navigateRoot('/main/home', { animated: true });
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

  async logout() {
    this.token = null;
    this.user = null;
    this.storage.clear();
    await this.validateToken();
    this.emmitter.emit(this.user);
    // this.navCtrl.navigateRoot('/main/home', {animated: true});
  }
}
