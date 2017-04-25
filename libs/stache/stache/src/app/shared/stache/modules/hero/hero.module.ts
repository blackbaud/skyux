import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheHeroComponent } from './hero.component';
import { StacheHeroHeadingComponent } from './hero-heading.component';
import { StacheHeroSubheadingComponent } from './hero-subheading.component';

@NgModule({
  declarations: [
    StacheHeroComponent,
    StacheHeroHeadingComponent,
    StacheHeroSubheadingComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheHeroComponent,
    StacheHeroHeadingComponent,
    StacheHeroSubheadingComponent
  ]
})
export class StacheHeroModule { }
