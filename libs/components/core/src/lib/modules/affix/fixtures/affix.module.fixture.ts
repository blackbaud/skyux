import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyAffixModule } from '../affix.module';

import { AffixFixtureComponent } from './affix.component.fixture';

@NgModule({
  imports: [CommonModule, SkyAffixModule],
  exports: [AffixFixtureComponent],
  declarations: [AffixFixtureComponent],
})
export class AffixFixturesModule {}
