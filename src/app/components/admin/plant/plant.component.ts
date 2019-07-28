import { Component, OnInit, Input } from '@angular/core';
import { Plant } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss'],
})
export class PlantComponent implements OnInit {

  @Input() plant: Plant;

  constructor() { }

  ngOnInit() {}

  editPlant(plant) {}

  deletePlant(plant) {}

}
