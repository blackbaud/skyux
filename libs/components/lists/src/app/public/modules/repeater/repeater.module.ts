import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyLogModule
} from '@skyux/core';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyChevronModule
} from '@skyux/indicators';

import {
  SkyInlineFormModule
} from '@skyux/inline-form';

import {
  SkyRepeaterComponent
} from './repeater.component';

import {
  SkyRepeaterItemContentComponent
} from './repeater-item-content.component';

import {
  SkyRepeaterItemContextMenuComponent
} from './repeater-item-context-menu.component';

import {
  SkyRepeaterItemComponent
} from './repeater-item.component';

import {
  SkyRepeaterItemTitleComponent
} from './repeater-item-title.component';

import {
  SkyRepeaterService
} from './repeater.service';

import {
  SkyListsResourcesModule
} from '../shared';

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
    SkyListsResourcesModule,
    SkyInlineFormModule
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
