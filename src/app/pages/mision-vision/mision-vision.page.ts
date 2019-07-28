import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mision-vision',
  templateUrl: './mision-vision.page.html',
  styleUrls: ['./mision-vision.page.scss'],
})
export class MisionVisionPage implements OnInit {

  slides = [
    {
      image: '/assets/img/003-sprout.svg',
      title: 'Misión',
      // tslint:disable-next-line: max-line-length
      desc: 'Contribuir con la conservación y la valoración de los recursos naturales, ejecutando, administrando e impulsando proyectos de arborización, reforestación y educación socioambiental.'
    },
    {
      image: '/assets/img/007-park.svg',
      title: 'Visión',
      // tslint:disable-next-line: max-line-length
      desc: 'Como organización social activa, responder con compromiso, proactividad y productividad a los desafíos de las problematicas ambientales de la comunidad, destacando valores humanos socioambientales que trasciendan en bien de toda la humanidad.'
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
