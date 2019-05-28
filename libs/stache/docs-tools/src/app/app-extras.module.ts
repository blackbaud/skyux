import {
  NgModule
} from '@angular/core';

import {
  SkyDocsDemoPageModule,
  SkyDocsSourceCodeProvider
} from './public';

import {
  SampleSourceCodeProvider
} from './public/plugin-resources/source-code-provider';

@NgModule({
  exports: [
    SkyDocsDemoPageModule
  ],
  providers: [
    {
      provide: SkyDocsSourceCodeProvider,
      useClass: SampleSourceCodeProvider
    }
  ]
})
export class AppExtrasModule { }
