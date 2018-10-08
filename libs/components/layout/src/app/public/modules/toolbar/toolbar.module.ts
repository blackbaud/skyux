import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyToolbarComponent } from './toolbar.component';
import { SkyToolbarItemComponent } from './toolbar-item.component';
import { SkyToolbarSectionComponent } from './toolbar-section.component';

@NgModule({
  declarations: [
    SkyToolbarComponent,
    SkyToolbarItemComponent,
    SkyToolbarSectionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkyToolbarComponent,
    SkyToolbarItemComponent,
    SkyToolbarSectionComponent
  ]
})
export class SkyToolbarModule { }
