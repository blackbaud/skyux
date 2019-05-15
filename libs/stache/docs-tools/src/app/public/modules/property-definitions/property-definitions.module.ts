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
  SkyPropertyDefinitionComponent
} from './property-definition.component';

import {
  SkyPropertyDefinitionsComponent
} from './property-definitions.component';

@NgModule({
  imports: [
    CommonModule,
    SkyCodeModule
  ],
  declarations: [
    SkyPropertyDefinitionComponent,
    SkyPropertyDefinitionsComponent
  ],
  exports: [
    SkyPropertyDefinitionComponent,
    SkyPropertyDefinitionsComponent
  ]
})
export class SkyPropertyDefinitionsModule { }
