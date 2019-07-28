import { Component, OnInit } from '@angular/core';
import { Zone } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.page.html',
  styleUrls: ['./zones.page.scss'],
})
export class ZonesPage implements OnInit {

   zones: Zone[] = [];

  constructor() { }

  ngOnInit() {
  }

  onSearchChange(event) {

  }

  addZone() {}

}
