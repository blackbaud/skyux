import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkyInlineDeleteModule } from '../../inline-delete/inline-delete.module';

import { SkyCardModule } from '../card.module';

import { CardTestComponent } from './card.component.fixture';

@NgModule({
  declarations: [CardTestComponent],
  imports: [
    CommonModule,
    SkyCardModule,
    SkyInlineDeleteModule,
    NoopAnimationsModule,
  ],
  exports: [CardTestComponent],
})
export class SkyCardFixturesModule {}
