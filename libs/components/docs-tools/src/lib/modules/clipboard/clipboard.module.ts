import { NgModule } from '@angular/core';

import { SkyClipboardButtonDirective } from './clipboard-button.directive';

/**
 * @internal
 */
@NgModule({
  imports: [SkyClipboardButtonDirective],
  exports: [SkyClipboardButtonDirective],
})
export class SkyClipboardModule {}
