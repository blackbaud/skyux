import { NgModule } from '@angular/core';
import { SkyTokensModule } from '@skyux/indicators';

import { TokensHarnessTestComponent } from './tokens-harness-test.component';

@NgModule({
  imports: [SkyTokensModule],
  declarations: [TokensHarnessTestComponent],
})
export class TokensHarnessTestModule {}
