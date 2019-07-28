import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.page.html',
  styleUrls: ['./plant.page.scss'],
})
export class PlantPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onSearchChange(event) {}

  edit(plant) {}

  delete(plant) {}

}
