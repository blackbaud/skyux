import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyIconClassListPipe } from './icon-class-list.pipe';
import { SkyIconStackComponent } from './icon-stack.component';
import { SkyIconSvgComponent } from './icon-svg.component';
import { SkyIconComponent } from './icon.component';

/**
 * @docsIncludeIds SkyIconComponent, SkyIconType, SkyIconVariantType, SkyIconHarness, SkyIconHarnessFilters, IconBasicExampleComponent, IconIconButtonExampleComponent
 */
@NgModule({
  declarations: [SkyIconClassListPipe, SkyIconComponent, SkyIconStackComponent],
  imports: [CommonModule, SkyIconSvgComponent],
  exports: [SkyIconComponent, SkyIconStackComponent],
})
export class SkyIconModule {}
