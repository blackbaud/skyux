import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { SkyCardActionsComponent } from './card-actions.component';
import { SkyCardContentComponent } from './card-content.component';
import { SkyCardTitleComponent } from './card-title.component';
import { SkyCardComponent } from './card.component';
import { SkyCheckboxModule } from '@skyux/forms/modules/checkbox';
import { SkyI18nModule } from '@skyux/i18n/modules/i18n';

@NgModule({
  declarations: [
    SkyCardActionsComponent,
    SkyCardComponent,
    SkyCardContentComponent,
    SkyCardTitleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyI18nModule
  ],
  exports: [
    SkyCardActionsComponent,
    SkyCardComponent,
    SkyCardContentComponent,
    SkyCardTitleComponent
  ]
})
export class SkyCardModule { }
