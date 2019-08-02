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

  public plants: Plant[] = [];
  public imageUrl: any = environment.imageUrl;
  public loading = true;

  constructor(
    private plantsService: PlantsService
  ) {
    this.loadData();
  }

  onSearchChange(event) {
  }

  loadData() {
    this.plantsService.getPlants().subscribe(
      (response: any) => {
        this.plants = response.data;
        this.loading = false;
      },
      (error) => {
        console.log('Error: ', error);
      }
    );
  }
}
