import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SkyCodeBlockModule } from '@blackbaud/skyux-lib-code-block';

import { SkyIconModule } from '@skyux/indicators';

import { SkyRepeaterModule } from '@skyux/lists';

import { SkyVerticalTabsetModule } from '@skyux/tabs';

import { SkyDocsToolsResourcesModule } from '../shared/sky-docs-tools-resources.module';

import { SkyDocsCodeExampleComponent } from './code-example.component';

import { SkyDocsCodeExamplesComponent } from './code-examples.component';

@NgModule({
  imports: [
    CommonModule,
    SkyCodeBlockModule,
    SkyDocsToolsResourcesModule,
    SkyIconModule,
    SkyRepeaterModule,
    SkyVerticalTabsetModule,
  ],
  declarations: [SkyDocsCodeExampleComponent, SkyDocsCodeExamplesComponent],
  exports: [SkyDocsCodeExampleComponent, SkyDocsCodeExamplesComponent],
})
export class SkyDocsCodeExamplesModule {}
