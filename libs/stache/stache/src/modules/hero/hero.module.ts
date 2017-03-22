import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheHeroComponent } from './hero.component';
import { StacheHeroHeadingComponent } from './hero-heading.component';

@NgModule({
  declarations: [
    StacheHeroComponent,
    StacheHeroHeadingComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheHeroComponent,
    StacheHeroHeadingComponent
  ]
})
export class StacheHeroModule { }
