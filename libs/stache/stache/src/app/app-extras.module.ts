import { NgModule } from '@angular/core';

import { StacheModule } from '../core';

import { StacheDemoComponentService } from './components/demo-component.service';

require('style-loader!./app.scss');

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    StacheModule
  ],
  exports: [
    StacheModule
  ],
  providers: [
    StacheDemoComponentService
  ],
  entryComponents: []
})
export class AppExtrasModule { }
