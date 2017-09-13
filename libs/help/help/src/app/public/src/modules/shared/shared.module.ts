import { NgModule } from '@angular/core';

import { HelpWidgetService } from './widget.service';
import { HelpInitializationService } from './initialization.service';

@NgModule({
  providers: [
    HelpWidgetService,
    HelpInitializationService
  ]
})
export class BBHelpSharedModule { }
