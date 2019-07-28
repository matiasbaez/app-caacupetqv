import { Component } from '@angular/core';
import { Plant } from '../../interfaces/interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlantsService } from '../../services/plants.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public plants: Observable<Plant>;
  public imageUrl: any = environment.imageUrl;

  constructor(
    private plantsService: PlantsService
  ) {
    this.loadData();
  }

  onSearchChange(event) {
  }

  loadData() {
    this.plants = this.plantsService.getPlants();
  }
}
