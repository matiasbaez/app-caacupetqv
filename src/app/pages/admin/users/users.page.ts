import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users: User[] = [];

  constructor() { }

  ngOnInit() {
  }

  onSearchChange(event) {}

  addUser() {}

}
