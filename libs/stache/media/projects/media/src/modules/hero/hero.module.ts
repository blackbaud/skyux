import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyHeroComponent
} from './hero.component';

import {
  SkyHeroHeadingComponent
} from './hero-heading.component';

import {
  SkyHeroSubheadingComponent
} from './hero-subheading.component';

@NgModule({
  declarations: [
    SkyHeroComponent,
    SkyHeroHeadingComponent,
    SkyHeroSubheadingComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkyHeroComponent,
    SkyHeroHeadingComponent,
    SkyHeroSubheadingComponent
  ]
})
export class SkyHeroModule { }
