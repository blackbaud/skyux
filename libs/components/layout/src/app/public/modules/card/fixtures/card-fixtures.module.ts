import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyCardModule } from '../';
import { CardTestComponent } from './card.component.fixture';

@NgModule({
  declarations: [
    CardTestComponent
  ],
  imports: [
    CommonModule,
    SkyCardModule
  ],
  exports: [
    CardTestComponent
  ]
})
export class SkyCardFixturesModule { }
