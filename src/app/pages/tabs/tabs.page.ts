import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  public logged: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.userService.emmitter.subscribe(user => {
      this.logged = (user) ? true : false;
    },
    err => {
      console.log('Error: ', err);
      this.logged = false;
    });
  }

  async ionViewWillEnter() {
    // this.logged = await this.userService.validateToken();
  }

  loginPage() {
    this.router.navigate(['/login-register']);
  }
}
