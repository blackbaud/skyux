import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { SkyCheckboxModule } from '@skyux/forms';

import { SkyCardModule } from '@skyux/layout';

import { SkyDropdownModule } from '@skyux/popovers';

import { CardDemoComponent } from './card-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyCardModule,
    SkyCheckboxModule,
    SkyDropdownModule,
  ],
  declarations: [CardDemoComponent],
  exports: [CardDemoComponent],
})
export class CardDemoModule {}
