import {
  NgModule
} from '@angular/core';

import {
  SkyDocsAnatomyModule
} from './modules/anatomy/anatomy.module';

import {
  SkyDocsCodeExamplesModule
} from './modules/code-examples/code-examples.module';

import {
  SkyDocsDemoModule
} from './modules/demo/demo.module';

import {
  SkyDocsDemoPageModule
} from './modules/demo-page/demo-page.module';

import {
  SkyDocsDesignGuidelinesModule
} from './modules/design-guidelines/design-guidelines.module';

import {
  SkyDocsSupportalService
} from './modules/shared/docs-tools-supportal.service';

/**
 * This module conveniently exports the most commonly used modules.
 */
@NgModule({
  exports: [
    SkyDocsAnatomyModule,
    SkyDocsCodeExamplesModule,
    SkyDocsDemoModule,
    SkyDocsDemoPageModule,
    SkyDocsDesignGuidelinesModule
  ],
  providers: [
    SkyDocsSupportalService
  ]
})
export class SkyDocsToolsModule { }
