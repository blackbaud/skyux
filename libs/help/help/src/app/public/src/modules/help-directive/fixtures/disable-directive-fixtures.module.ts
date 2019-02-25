import { NgModule } from '@angular/core';

import { HelpBBHelpTestComponent } from './help.component.fixture';
import { BBHelpModule } from '../../../..';

@NgModule({
  declarations: [
    HelpBBHelpTestComponent
  ],
  exports: [
    HelpBBHelpTestComponent
  ],
  imports: [
    BBHelpModule
  ]
})
export class DisableDirectiveFixturesModule { }
