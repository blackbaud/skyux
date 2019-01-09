import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  CardTestComponent
} from './card.component.fixture';

import {
  SkyCardModule
} from '../';

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
