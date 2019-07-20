import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}

  segmentChanged(event) {
    console.log("event: ", event.detail.value);
  }

  onSearchChange(event) {
    
  }
}
