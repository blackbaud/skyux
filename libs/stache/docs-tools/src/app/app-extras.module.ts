import {
  NgModule
} from '@angular/core';

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
} from './public/plugin-resources/source-code-provider';

@NgModule({
  exports: [
    SkyAppLinkModule,
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
