import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plant } from '../../interfaces/interfaces';
import { environment } from '../../../environments/environment';
import { PlantsService } from '../../services/plants.service';
import { DataService } from '../../services/data.service';

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
    private dataService: DataService,
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
        this.plantsService.searchByName(event.detail.value)
        .then((response: any) => {
          const parse = this.dataService.parseData(response.data);
          this.loading = false;
          this.plants = parse.data;
        })
        .catch((error) => {
          console.log('Error: ', error);
          this.loading = false;
        });
      }
    } else { this.loadData(null, true); }
  }

  loadData(event?, pull: boolean = false) {
    this.plantsService.getPlants(pull)
    .then((response: any) => {
      this.loading = false;
      const parse = this.dataService.parseData(response.data);
      this.plants.push(...parse.data);
      if (event) {
        event.target.complete();

        if (parse.data.length === 0) { this.infScrollDisabled = true; }
      }
    })
    .catch((error) => {
      console.log('Error: ', error);
      this.loading = false;
    });
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
