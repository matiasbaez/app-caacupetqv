import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbsolutizePipe } from './absolutize.pipe';
import { UrlSanitizerPipe } from './url-sanitizer.pipe';

@NgModule({
  declarations: [AbsolutizePipe, UrlSanitizerPipe],
  imports: [
    CommonModule
  ],
  exports: [AbsolutizePipe, UrlSanitizerPipe]
})
export class PipesModule { }
