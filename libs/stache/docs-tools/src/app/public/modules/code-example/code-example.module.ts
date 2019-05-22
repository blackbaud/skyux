import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyCodeBlockModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyVerticalTabsetModule
} from '@skyux/tabs';

import {
  SkyDocsToolsResourcesModule
} from '../shared/docs-tools-resources.module';

import {
  SkyDocsCodeExampleComponent
} from './code-example.component';

import {
  SkyDocsCodeExamplesProvider
} from './code-examples-provider';
import { SkyDocsCodeExampleEditorService } from './code-example-editor.service';

@NgModule({
  imports: [
    CommonModule,
    SkyCodeBlockModule,
    SkyDocsToolsResourcesModule,
    SkyIconModule,
    SkyRepeaterModule,
    SkyVerticalTabsetModule
  ],
  declarations: [
    SkyDocsCodeExampleComponent
  ],
  exports: [
    SkyDocsCodeExampleComponent
  ],
  providers: [
    SkyDocsCodeExampleEditorService,
    SkyDocsCodeExamplesProvider
  ]
})
export class SkyDocsCodeExampleModule { }
