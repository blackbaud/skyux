import { NgModule } from '@angular/core';

import { SkyAuthHttpClientModule } from '@skyux/http';

import { SkyDocsAnatomyModule } from './modules/anatomy/anatomy.module';

import { SkyDocsCodeExamplesModule } from './modules/code-examples/code-examples.module';

import { SkyDocsDemoModule } from './modules/demo/demo.module';

import { SkyDocsDemoPageModule } from './modules/demo-page/demo-page.module';

import { SkyDocsDesignGuidelinesModule } from './modules/design-guidelines/design-guidelines.module';

/**
 * This module conveniently exports the most commonly used modules.
 */
@NgModule({
  exports: [
    SkyAuthHttpClientModule, // Supports the supportal service calls using the `svcid` param.
    SkyDocsAnatomyModule,
    SkyDocsCodeExamplesModule,
    SkyDocsDemoModule,
    SkyDocsDemoPageModule,
    SkyDocsDesignGuidelinesModule,
  ],
})
export class SkyDocsToolsModule {}
