import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyPopoverModule
} from '../popover/popover.module';

import {
  SkyPopoversResourcesModule
} from '../shared/popovers-resources.module';

import {
  SkyDropdownButtonComponent
} from './dropdown-button.component';

import {
  SkyDropdownItemComponent
} from './dropdown-item.component';

import {
  SkyDropdownMenuComponent
} from './dropdown-menu.component';

import {
  SkyDropdownComponent
} from './dropdown.component';

@NgModule({
  declarations: [
    SkyDropdownButtonComponent,
    SkyDropdownComponent,
    SkyDropdownItemComponent,
    SkyDropdownMenuComponent
  ],
  imports: [
    CommonModule,
    SkyIconModule,
    SkyPopoverModule,
    SkyPopoversResourcesModule
  ],
  exports: [
    SkyDropdownButtonComponent,
    SkyDropdownComponent,
    SkyDropdownItemComponent,
    SkyDropdownMenuComponent
  ],
  providers: [
    SkyWindowRefService
  ]
})
export class SkyDropdownModule { }
