import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyTokensModule } from '@skyux/indicators';

import { TokensHarnessTestComponent } from './tokens-harness-test.component';

@NgModule({
  imports: [NoopAnimationsModule, SkyTokensModule],
  declarations: [TokensHarnessTestComponent],
})
export class TokensHarnessTestModule {}
