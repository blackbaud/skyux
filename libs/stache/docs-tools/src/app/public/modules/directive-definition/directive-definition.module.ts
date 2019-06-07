import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyDocsDirectiveDefinitionComponent
} from './directive-definition.component';

@NgModule({
  imports: [
    CommonModule,
    SkyCodeModule
  ],
  declarations: [
    SkyDocsDirectiveDefinitionComponent
  ],
  exports: [
    SkyDocsDirectiveDefinitionComponent
  ]
})
export class SkyDocsDirectiveDefinitionModule { }
