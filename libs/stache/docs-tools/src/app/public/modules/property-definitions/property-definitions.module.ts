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
  SkyDefinitionListModule
} from '@skyux/layout';

import {
  SkyPropertyDefinitionComponent
} from './property-definition.component';

import {
  SkyDocsPropertyDefinitionsComponent
} from './property-definitions.component';

@NgModule({
  imports: [
    CommonModule,
    SkyCodeModule,
    SkyDefinitionListModule
  ],
  declarations: [
    SkyPropertyDefinitionComponent,
    SkyDocsPropertyDefinitionsComponent
  ],
  exports: [
    SkyPropertyDefinitionComponent,
    SkyDocsPropertyDefinitionsComponent
  ]
})
export class SkyDocsPropertyDefinitionsModule { }
