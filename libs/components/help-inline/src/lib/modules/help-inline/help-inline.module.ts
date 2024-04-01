import { NgModule } from '@angular/core';

import { SkyHelpInlineAriaExpandedPipe } from './help-inline-aria-expanded.pipe';
import { SkyHelpInlineComponent } from './help-inline.component';

@NgModule({
  imports: [SkyHelpInlineComponent, SkyHelpInlineAriaExpandedPipe],
  exports: [SkyHelpInlineComponent],
})
export class SkyHelpInlineModule {}
