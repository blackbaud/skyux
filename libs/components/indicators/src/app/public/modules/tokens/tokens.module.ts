import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyTokenComponent } from './token.component';
import { SkyTokensComponent } from './tokens.component';

@NgModule({
  declarations: [
    SkyTokenComponent,
    SkyTokensComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkyTokenComponent,
    SkyTokensComponent
  ]
})
export class SkyTokensModule { }
