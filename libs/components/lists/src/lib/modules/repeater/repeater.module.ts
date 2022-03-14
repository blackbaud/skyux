import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyChevronModule, SkyIconModule } from '@skyux/indicators';
import { SkyInlineFormModule } from '@skyux/inline-form';

import { DragulaModule } from 'ng2-dragula';

import { SkyListsResourcesModule } from '../shared/sky-lists-resources.module';

import { SkyRepeaterItemContentComponent } from './repeater-item-content.component';
import { SkyRepeaterItemContextMenuComponent } from './repeater-item-context-menu.component';
import { SkyRepeaterItemTitleComponent } from './repeater-item-title.component';
import { SkyRepeaterItemComponent } from './repeater-item.component';
import { SkyRepeaterComponent } from './repeater.component';

@NgModule({
  declarations: [
    SkyRepeaterComponent,
    SkyRepeaterItemComponent,
    SkyRepeaterItemContentComponent,
    SkyRepeaterItemContextMenuComponent,
    SkyRepeaterItemTitleComponent,
  ],
  imports: [
    CommonModule,
    DragulaModule,
    SkyChevronModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyInlineFormModule,
    SkyListsResourcesModule,
  ],
  exports: [
    SkyRepeaterComponent,
    SkyRepeaterItemComponent,
    SkyRepeaterItemContentComponent,
    SkyRepeaterItemContextMenuComponent,
    SkyRepeaterItemTitleComponent,
  ],
})
export class SkyRepeaterModule {}
