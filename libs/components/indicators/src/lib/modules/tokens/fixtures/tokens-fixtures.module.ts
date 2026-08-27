import { NgModule } from '@angular/core';

import { SkyTokensModule } from '../tokens.module';

import { SkyTokenTestComponent } from './token.component.fixture';
import { SkyTokensProjectedTokenTestComponent } from './tokens-projected-token.component.fixture';
import { SkyTokensTestComponent } from './tokens.component.fixture';

@NgModule({
  declarations: [
    SkyTokenTestComponent,
    SkyTokensTestComponent,
    SkyTokensProjectedTokenTestComponent,
  ],
  imports: [SkyTokensModule],
  exports: [
    SkyTokenTestComponent,
    SkyTokensTestComponent,
    SkyTokensProjectedTokenTestComponent,
  ],
})
export class SkyTokensFixturesModule {}
