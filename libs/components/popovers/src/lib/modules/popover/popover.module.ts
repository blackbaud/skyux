import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAffixModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { SkyPopoversResourcesModule } from '../shared/sky-popovers-resources.module';

import { SkyPopoverContentComponent } from './popover-content.component';
import { SkyPopoverComponent } from './popover.component';
import { SkyPopoverDirective } from './popover.directive';

@NgModule({
  declarations: [
    SkyPopoverComponent,
    SkyPopoverContentComponent,
    SkyPopoverDirective,
  ],
  imports: [
    CommonModule,
    SkyAffixModule,
    SkyIconModule,
    SkyPopoversResourcesModule,
    SkyThemeModule,
  ],
  exports: [
    SkyPopoverComponent,
    SkyPopoverContentComponent,
    SkyPopoverDirective,
  ],
})
export class SkyPopoverModule {}
