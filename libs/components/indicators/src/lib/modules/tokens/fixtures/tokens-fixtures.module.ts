import { NgModule } from '@angular/core';

import { SkyTokensModule } from '../tokens.module';

import { SkyTokenTestComponent } from './token.component.fixture';
import { SkyTokensTestComponent } from './tokens.component.fixture';

@NgModule({
  declarations: [SkyTokenTestComponent, SkyTokensTestComponent],
  imports: [SkyTokensModule],
  exports: [SkyTokenTestComponent, SkyTokensTestComponent],
})
export class SkyTokensFixturesModule {}
