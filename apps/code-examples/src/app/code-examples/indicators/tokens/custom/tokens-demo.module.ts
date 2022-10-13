import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyIconModule, SkyTokensModule } from '@skyux/indicators';

import { TokensDemoComponent } from './tokens-demo.component';

@NgModule({
  imports: [CommonModule, SkyIconModule, SkyIdModule, SkyTokensModule],
  exports: [TokensDemoComponent],
  declarations: [TokensDemoComponent],
})
export class TokensDemoModule {}
