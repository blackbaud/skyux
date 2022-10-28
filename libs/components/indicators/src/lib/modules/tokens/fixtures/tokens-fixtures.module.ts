import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkyTokensModule } from '../tokens.module';

import { SkyTokenA11yTestComponent } from './token-a11y.component.fixture';
import { SkyTokenTestComponent } from './token.component.fixture';
import { SkyTokensTestComponent } from './tokens.component.fixture';

@NgModule({
  declarations: [
    SkyTokenA11yTestComponent,
    SkyTokenTestComponent,
    SkyTokensTestComponent,
  ],
  imports: [CommonModule, NoopAnimationsModule, SkyTokensModule],
  exports: [
    SkyTokenA11yTestComponent,
    SkyTokenTestComponent,
    SkyTokensTestComponent,
  ],
})
export class SkyTokensFixturesModule {}
