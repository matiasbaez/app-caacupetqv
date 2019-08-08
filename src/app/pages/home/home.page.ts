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
    // this.subscription = this.platform.backButton.subscribe(() => {
    //   navigator['app'].exitApp();
    // });
  }

  onSearchChange(event: any) {
    if (event.detail.value !== '') {
      if (event.detail.value.length >= 3) {
        this.loading = true;
        this.plantsService.searchByName(event.detail.value).subscribe(
          (response: any) => {
            this.loading = false;
            this.plants = response.data;
          },
          (error) => {
            console.log('Error: ', error);
            this.loading = false;
          }
        );
      }
    } else { this.loadData(); }
  }

  loadData() {
    this.plantsService.getPlants().subscribe(
      (response: any) => {
        this.loading = false;
        this.plants = response.data;
      },
      (error) => {
        console.log('Error: ', error);
        this.loading = false;
      }
    );
  }

  // ionViewWillLeave() {
  //   this.subscription.unsubscribe();
  // }
}
