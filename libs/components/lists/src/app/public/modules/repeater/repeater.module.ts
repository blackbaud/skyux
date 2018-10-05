import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SkyChevronModule } from '@skyux/indicators/modules/chevron';
import { SkyLogModule } from '@skyux/core/modules/log';

import { SkyRepeaterItemContentComponent } from './repeater-item-content.component';
import { SkyRepeaterItemContextMenuComponent } from './repeater-item-context-menu.component';
import { SkyRepeaterItemTitleComponent } from './repeater-item-title.component';
import { SkyRepeaterItemComponent } from './repeater-item.component';
import { SkyRepeaterComponent } from './repeater.component';
import { SkyRepeaterService } from './repeater.service';
import { SkyCheckboxModule } from '@skyux/forms/modules/checkbox';
import { SkyI18nModule } from '@skyux/i18n/modules/i18n';

@NgModule({
  declarations: [
    SkyRepeaterComponent,
    SkyRepeaterItemComponent,
    SkyRepeaterItemContentComponent,
    SkyRepeaterItemContextMenuComponent,
    SkyRepeaterItemTitleComponent
  ],
  providers: [
    SkyRepeaterService
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    SkyChevronModule,
    SkyLogModule,
    SkyCheckboxModule,
    SkyI18nModule
  ],
  exports: [
    SkyRepeaterComponent,
    SkyRepeaterItemComponent,
    SkyRepeaterItemContentComponent,
    SkyRepeaterItemContextMenuComponent,
    SkyRepeaterItemTitleComponent
  ]
})
export class SkyRepeaterModule { }
