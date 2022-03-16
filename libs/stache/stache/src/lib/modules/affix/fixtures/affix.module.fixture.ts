import { NgModule } from '@angular/core';
import { SkyCodeModule } from '@blackbaud/skyux-lib-code-block';

import { StacheAffixModule } from '../affix.module';

import { AffixTopFixtureComponent } from './affix-top.component.fixture';
import { AffixFixtureComponent } from './affix.component.fixture';

@NgModule({
  declarations: [AffixFixtureComponent, AffixTopFixtureComponent],
  imports: [SkyCodeModule, StacheAffixModule],
  exports: [AffixFixtureComponent, AffixTopFixtureComponent],
})
export class AffixFixtureModule {}
