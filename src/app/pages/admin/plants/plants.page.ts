import { Component, OnInit } from '@angular/core';
import { Plant } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-plants',
  templateUrl: './plants.page.html',
  styleUrls: ['./plants.page.scss'],
})
export class PlantsPage implements OnInit {

  plants: Plant[] = [];

  constructor() {}

  ngOnInit() {
  }

  onSearchChange(event) { }

  addPlant() {}

}
