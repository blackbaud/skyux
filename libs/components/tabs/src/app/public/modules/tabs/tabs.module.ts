import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  SkyTabButtonComponent
} from './tab-button.component';
import {
  SkyTabDropdownComponent
} from './tab-dropdown.component';
import {
  SkyTabComponent
} from './tab.component';
import {
  SkyTabsetComponent
} from './tabset.component';
import {
  SkyTabsetNavButtonComponent
} from './tabset-nav-button.component';

import {
 SkyDropdownModule
} from '@skyux/popovers/modules/dropdown';
import {
  SkyI18nModule
} from '@skyux/i18n/modules/i18n';
import {
  SkyIconModule
} from '@skyux/indicators/modules/icon';

@NgModule({
  declarations: [
    SkyTabButtonComponent,
    SkyTabComponent,
    SkyTabDropdownComponent,
    SkyTabsetComponent,
    SkyTabsetNavButtonComponent
  ],
  imports: [
    CommonModule,
    SkyDropdownModule,
    SkyI18nModule,
    SkyIconModule
  ],
  exports: [
    SkyTabComponent,
    SkyTabsetComponent,
    SkyTabsetNavButtonComponent
  ]
})
export class SkyTabsModule { }
