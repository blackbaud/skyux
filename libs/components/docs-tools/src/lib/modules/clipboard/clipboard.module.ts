import { NgModule } from '@angular/core';

import { SkyDocsClipboardButtonDirective } from './clipboard-button.directive';

/**
 * @internal
 */
@NgModule({
  imports: [SkyDocsClipboardButtonDirective],
  exports: [SkyDocsClipboardButtonDirective],
})
export class SkyDocsClipboardModule {}
