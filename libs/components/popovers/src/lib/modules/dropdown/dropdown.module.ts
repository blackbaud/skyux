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
import { SkyDropdownComponent } from './dropdown.component';

/**
 * @docsIncludeIds SkyDropdownComponent, SkyDropdownButtonComponent, SkyDropdownMenuComponent, SkyDropdownItemComponent, SkyDropdownButtonType, SkyDropdownHorizontalAlignment, SkyDropdownTriggerType, SkyDropdownHarness, SkyDropdownHarnessFilters, SkyDropdownItemHarness, SkyDropdownItemHarnessFilters, SkyDropdownMenuHarness, SkyDropdownMenuHarnessFilters
 */
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
  ],
})
export class SkyDropdownModule {}
