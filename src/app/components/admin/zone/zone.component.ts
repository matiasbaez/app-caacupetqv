import { Component, OnInit, Input } from '@angular/core';
import { Zone } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss'],
})
export class ZoneComponent implements OnInit {

  @Input() zone: Zone;

  constructor() { }

  ngOnInit() {}

  editZone() {}

  deleteZone() {}

}
