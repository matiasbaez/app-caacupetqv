import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, IonRefresher, IonInfiniteScroll } from '@ionic/angular';
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

  @ViewChild('infiniteScroll', {static: false}) infScroll: IonInfiniteScroll;
  @ViewChild('refresher', {static: false}) refresher: IonRefresher;

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
    this.plantsService.getPlants(pull).subscribe(
      (response: any) => {
        this.loading = false;
        this.plants.push(...response.data);
        if (event) {
          event.target.disabled = true;
          event.target.complete();

          if (response.data.length === 0) { this.infScrollDisabled = true; }

          setTimeout(() => {
            event.target.disabled = false;
          }, 100);
        }
      },
      (error) => {
        console.log('Error: ', error);
        this.loading = false;
        if (event) {
          event.target.complete();
        }
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
