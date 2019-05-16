import {
  NgModule
} from '@angular/core';

import {
  SkyDocsDemoPageModule,
  SkyDocsPropertyDefinitionsModule
} from './public';

@NgModule({
  exports: [
    SkyDocsDemoPageModule,
    SkyDocsPropertyDefinitionsModule
  ]
})
export class AppExtrasModule { }
