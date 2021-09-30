import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyToolbarComponent
} from './toolbar.component';

import {
  SkyToolbarItemComponent
} from './toolbar-item.component';

import {
  SkyToolbarSectionComponent
} from './toolbar-section.component';

import {
  SkyToolbarViewActionsComponent
} from './toolbar-view-actions.component';

@NgModule({
  declarations: [
    SkyToolbarComponent,
    SkyToolbarItemComponent,
    SkyToolbarSectionComponent,
    SkyToolbarViewActionsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkyToolbarComponent,
    SkyToolbarItemComponent,
    SkyToolbarSectionComponent,
    SkyToolbarViewActionsComponent
  ]
})
export class SkyToolbarModule { }
