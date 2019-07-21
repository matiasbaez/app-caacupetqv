import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbsolutizePipe } from './absolutize.pipe';

@NgModule({
  declarations: [AbsolutizePipe],
  imports: [
    CommonModule
  ],
  exports: [AbsolutizePipe]
})
export class PipesModule { }
