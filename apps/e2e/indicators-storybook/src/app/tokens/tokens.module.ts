import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { SkyTokensModule } from '@skyux/indicators';

import { TokensComponent } from './tokens.component';

const routes: Routes = [{ path: '', component: TokensComponent }];
@NgModule({
  declarations: [TokensComponent],
  imports: [
    CommonModule,
    NoopAnimationsModule,
    RouterModule.forChild(routes),
    SkyTokensModule,
  ],
  exports: [TokensComponent],
})
export class TokensModule {}
