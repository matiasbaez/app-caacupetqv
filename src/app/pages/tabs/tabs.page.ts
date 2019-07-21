import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  public logged: boolean = false;
  public user: any;

  constructor(
    private router: Router,
    private storage: Storage,
    private dataService: DataService
  ) {
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
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
        this.storage.set('user', response.user);
        this.user = response.user;
      },
      (error) => {
        console.log('Error: ', error);
      });
    }
  }

  loginPage() {
    this.router.navigate(['/login-register']);
  }
}
