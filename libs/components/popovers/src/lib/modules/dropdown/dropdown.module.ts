import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  SkyAffixModule,
  SkyIdModule,
  SkyScreenReaderLabelDirective,
} from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { SkyPopoversResourcesModule } from '../shared/sky-popovers-resources.module';

import { SkyDropdownButtonComponent } from './dropdown-button.component';
import { SkyDropdownItemComponent } from './dropdown-item.component';
import { SkyDropdownMenuComponent } from './dropdown-menu.component';
import { SkyDropdownTriggerDirective } from './dropdown-trigger.directive';
import { SkyDropdownComponent } from './dropdown.component';

@NgModule({
  declarations: [
    SkyDropdownButtonComponent,
    SkyDropdownComponent,
    SkyDropdownItemComponent,
    SkyDropdownMenuComponent,
  ],
  imports: [
    CommonModule,
    SkyAffixModule,
    SkyDropdownTriggerDirective,
    SkyIconModule,
    SkyIdModule,
    SkyPopoversResourcesModule,
    SkyScreenReaderLabelDirective,
    SkyThemeModule,
  ],
  exports: [
    SkyDropdownButtonComponent,
    SkyDropdownComponent,
    SkyDropdownItemComponent,
    SkyDropdownMenuComponent,
    SkyDropdownTriggerDirective,
  ],
})
export class SkyDropdownModule {}
