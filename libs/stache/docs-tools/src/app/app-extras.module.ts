import {
  NgModule
} from '@angular/core';

import {
  SkyCodeBlockModule,
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyPopoverModule
} from '@skyux/popovers';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyDocsDemoPageModule,
  SkyDocsSourceCodeProvider
} from './public';

import {
  SampleSourceCodeProvider
} from './public/plugin-resources/sample-source-code-provider';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCodeBlockModule,
    SkyCodeModule,
    SkyDocsDemoPageModule,
    SkyPopoverModule
  ],
  providers: [
    {
      provide: SkyDocsSourceCodeProvider,
      useClass: SampleSourceCodeProvider
    }
  ]
})
export class AppExtrasModule { }
