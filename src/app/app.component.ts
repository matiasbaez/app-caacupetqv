import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DataService } from './services/data.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public menuItems: Observable<any>;
  public user;
  public logged: boolean = false;

  private token;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private dataService: DataService,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.getToken();
      this.menuItems = this.dataService.getMenuItems();
    });
  }

  async getToken() {
    await this.storage.get('token').then(token => {
      if (token) {
        this.logged = true;
        this.profile();
      }
    }).catch(error => {
      console.log('getToken error: ', error);
    });
  }

  async profile() {
    this.user = await this.storage.get('user');
    if (!this.user) {
      this.dataService.getProfile().subscribe(
        (response: any) => {
          console.log('response: ', response);
          this.storage.set('user', response.user);
          this.user = response.user;
          this.logged = true;
        },
        (error) => {
          console.log('Error: ', error);
          this.logged = false;
        });
    } else this.logged = true;
  }
}
