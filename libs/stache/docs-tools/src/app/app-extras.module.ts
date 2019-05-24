import {
  NgModule
} from '@angular/core';

import {
  SkyDocsDemoPageModule,
  SkyDocsPropertyDefinitionsModule,
  SkyDocsSourceCodeProvider
} from './public';

import {
  SampleSourceCodeProvider
} from './public/plugin-resources/sample-source-code-provider';

@NgModule({
  exports: [
    SkyDocsDemoPageModule,
    SkyDocsPropertyDefinitionsModule
  ],
  providers: [
    {
      provide: SkyDocsSourceCodeProvider,
      useClass: SampleSourceCodeProvider
    }
  ]
})
export class AppExtrasModule { }
