import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyFormatComponent } from './format.component';

/**
 * @docsIncludeIds SkyFormatComponent, SkyAppFormat, LayoutFormatExampleComponent
 */
@NgModule({
  declarations: [SkyFormatComponent],
  imports: [CommonModule],
  exports: [SkyFormatComponent],
})
export class SkyFormatModule {}
