import {
  NgModule
} from '@angular/core';

import {
  SkyHelpInlineModule
} from '../../public';

import {
  SkyHelpInlineDemoComponent
} from './help-inline-demo.component';

@NgModule({
  declarations: [
    SkyHelpInlineDemoComponent
  ],
  imports: [
    SkyHelpInlineModule
  ],
  exports: [
    SkyHelpInlineDemoComponent
  ]
})
export class SkyHelpInlineDemoModule {}
