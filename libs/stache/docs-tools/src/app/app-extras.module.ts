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
  SkyDocsCodeExamplesModule,
  SkyDocsDemoModule,
  SkyDocsDemoPageModule,
  SkyDocsDemoPageTypeDefinitionsProvider,
  SkyDocsSourceCodeProvider
} from './public';

import {
  SampleSourceCodeProvider
} from './public/plugin-resources/sample-source-code-provider';

import {
  SampleTypeDefinitionsProvider
} from './public/plugin-resources/sample-type-definitions-provider';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCodeBlockModule,
    SkyCodeModule,
    SkyDocsCodeExamplesModule,
    SkyDocsDemoModule,
    SkyDocsDemoPageModule,
    SkyPopoverModule
  ],
  providers: [
    {
      provide: SkyDocsSourceCodeProvider,
      useClass: SampleSourceCodeProvider
    },
    {
      provide: SkyDocsDemoPageTypeDefinitionsProvider,
      useClass: SampleTypeDefinitionsProvider
    }
  ]
})
export class AppExtrasModule { }
