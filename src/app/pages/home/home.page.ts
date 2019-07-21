import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Plant } from '../../interfaces/interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public plants: Observable<Plant>;
  public imageUrl: any = environment.imageUrl;

  constructor(
    private dataService: DataService
  ) {
    this.loadData();
  }

  onSearchChange(event) {
  }

  loadData() {
    this.plants = this.dataService.getPlants();
  }
}
