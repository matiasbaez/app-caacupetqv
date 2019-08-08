import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plant } from '../../interfaces/interfaces';
import { environment } from '../../../environments/environment';
import { PlantsService } from '../../services/plants.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public plants: Plant[] = [];
  public imageUrl: any = environment.imageUrl;
  public loading = true;
  public infScrollDisabled = false;
  private subscription: any;

  constructor(
    private plantsService: PlantsService,
    private platform: Platform
  ) {}

  ionViewDidEnter() {
    // this.subscription = this.platform.backButton.subscribe(() => {
    //   navigator['app'].exitApp();
    // });
  }

  ngOnInit() {
    this.loadData();
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
    } else { this.loadData(null, true); }
  }

  loadData(event?, pull: boolean = false) {
    console.log("loadData");
    this.plantsService.getPlants(pull).subscribe(
      (response: any) => {
        this.loading = false;
        this.plants.push(...response.data);
        if (event) {
          event.target.complete();

          console.log('length: ', response.data.length);
          if (response.data.length === 0) { this.infScrollDisabled = true; }
          console.log('disabled: ', this.infScrollDisabled);
        }
      },
      (error) => {
        console.log('Error: ', error);
        this.loading = false;
      }
    );
  }

  refresh(event) {
    this.loadData(event, true);
    this.plants = [];
    this.infScrollDisabled = false;
  }

  // ionViewWillLeave() {
  //   this.subscription.unsubscribe();
  // }
}
