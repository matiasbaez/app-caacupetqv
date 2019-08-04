import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plant } from '../../interfaces/interfaces';
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
  private subscription: any;

  constructor(
    private plantsService: PlantsService,
    private platform: Platform
  ) {
    this.loadData();
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
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

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
}
