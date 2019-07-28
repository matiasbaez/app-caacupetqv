import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Plant } from '../../../interfaces/interfaces';
import { PlantsService } from '../../../services/plants.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss'],
})
export class PlantComponent implements OnInit {

  @Input() plant: Plant;
  @Output() edit: EventEmitter<any> = new EventEmitter();

  constructor(
    private plantsService: PlantsService,
    private uiService: UIService
  ) { }

  ngOnInit() {}

  editPlant(plant) {
    this.edit.emit(plant);
  }

  async deletePlant(plantId) {
    const deleted = await this.plantsService.deletePlant(plantId);
    let message;
    if (deleted) {
      message = 'La planta ha sido eliminada';
    } else {
      message = 'Ha ocurrido un error, por favor intentelo más tarde';
    }
    this.uiService.showToast(message);
  }

}
