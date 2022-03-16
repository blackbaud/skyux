import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyHeroHeadingComponent } from './hero-heading.component';
import { SkyHeroSubheadingComponent } from './hero-subheading.component';
import { SkyHeroComponent } from './hero.component';

@NgModule({
  declarations: [
    SkyHeroComponent,
    SkyHeroHeadingComponent,
    SkyHeroSubheadingComponent,
  ],
  imports: [CommonModule],
  exports: [
    SkyHeroComponent,
    SkyHeroHeadingComponent,
    SkyHeroSubheadingComponent,
  ],
})
export class SkyHeroModule {}
