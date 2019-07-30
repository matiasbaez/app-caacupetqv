import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/interfaces';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users: User[] = [];

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getUserList().subscribe(
      (response: any) => {
        this.users = response.data;
      },
      (error) => {
        console.log('Error: ', error);
      }
    );
  }

  onSearchChange(event) {}

  addUser() {}

}
