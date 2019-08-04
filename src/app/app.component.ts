import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DataService } from './services/data.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public menuItems: Observable<any>;
  public user;
  public logged: boolean = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private dataService: DataService,
    private storage: Storage,
    private userService: UserService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.userData();
      this.menuItems = this.dataService.getMenuItems();
    });
  }

  async userData() {
    this.logged = await this.userService.providerTokenValidation();
    if (this.logged) {
      this.user = await this.userService.getUser();
    }
    this.userService.emmitter.subscribe(user => {
      this.user = user;
      this.logged = (user) ? true : false;
    },
    err => {
      console.log('Error: ', err);
      this.logged = false;
    });
  }
}
