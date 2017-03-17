import { NgModule } from '@angular/core';
import { StacheModule } from '../core';

require('style!../styles/stache.scss');

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    StacheModule
  ],
  exports: [
    StacheModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
