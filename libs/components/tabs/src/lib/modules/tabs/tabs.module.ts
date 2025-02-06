import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIdModule, SkyResponsiveHostDirective } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyThemeModule } from '@skyux/theme';

import { SkyTabsResourcesModule } from '../shared/sky-tabs-resources.module';

import { SkyTabButtonComponent } from './tab-button.component';
import { SkyTabComponent } from './tab.component';
import { SkyTabsetNavButtonDisabledPipe } from './tabset-nav-button-disabled.pipe';
import { SkyTabsetNavButtonComponent } from './tabset-nav-button.component';
import { SkyTabsetComponent } from './tabset.component';

@NgModule({
  declarations: [
    SkyTabButtonComponent,
    SkyTabComponent,
    SkyTabsetComponent,
    SkyTabsetNavButtonComponent,
    SkyTabsetNavButtonDisabledPipe,
  ],
  imports: [
    CommonModule,
    SkyResponsiveHostDirective,
    SkyDropdownModule,
    SkyIconModule,
    SkyIdModule,
    SkyTabsResourcesModule,
    SkyThemeModule,
  ],
  exports: [SkyTabComponent, SkyTabsetComponent, SkyTabsetNavButtonComponent],
})
export class SkyTabsModule {}
