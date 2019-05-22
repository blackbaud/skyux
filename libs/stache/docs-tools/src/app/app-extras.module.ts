import {
  NgModule
} from '@angular/core';

import {
  SkyDocsCodeExamplesProvider,
  SkyDocsDemoPageModule,
  SkyDocsPropertyDefinitionsModule
} from './public';

import {
  SkyPopoversCodeExamplesProvider
} from './code-examples-provider';

@NgModule({
  exports: [
    SkyDocsDemoPageModule,
    SkyDocsPropertyDefinitionsModule
  ],
  providers: [
    {
      provide: SkyDocsCodeExamplesProvider,
      useClass: SkyPopoversCodeExamplesProvider
    }
  ]
})
export class AppExtrasModule { }
