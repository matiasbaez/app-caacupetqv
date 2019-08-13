import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.page.html',
  styleUrls: ['./navigation.page.scss'],
})
export class NavigationPage implements OnInit {

  constructor(
    private userService: UserService
  ) { }

  async ionViewWillEnter() {
    await this.userService.providerTokenValidation();
  }

  ngOnInit() {
  }

}
