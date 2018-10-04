import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  SkyWindowRefService
} from '@skyux/core/modules/window';
import {
  SkyPopoverModule
} from '../popover';
import {
  SkyIconModule
} from '@skyux/indicators/modules/icon';

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
    SkyPopoverModule,
    SkyIconModule
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
