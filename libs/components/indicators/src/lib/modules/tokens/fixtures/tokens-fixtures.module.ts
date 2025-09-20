import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkyTokensModule } from '../tokens.module';

import { SkyTokenTestComponent } from './token.component.fixture';
import { SkyTokensTestComponent } from './tokens.component.fixture';

@NgModule({
  declarations: [SkyTokenTestComponent, SkyTokensTestComponent],
  imports: [NoopAnimationsModule, SkyTokensModule],
  exports: [SkyTokenTestComponent, SkyTokensTestComponent],
})
export class SkyTokensFixturesModule {}
