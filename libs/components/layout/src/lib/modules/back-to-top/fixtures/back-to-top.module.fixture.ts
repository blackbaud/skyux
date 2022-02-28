import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyBackToTopModule } from '../back-top-top.module';

import { SkyBackToTopFixtureComponent } from './back-to-top.component.fixture';

@NgModule({
  imports: [CommonModule, SkyBackToTopModule],
  exports: [SkyBackToTopFixtureComponent],
  declarations: [SkyBackToTopFixtureComponent],
})
export class SkyBackToTopFixturesModule {}
