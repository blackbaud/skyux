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
  SkyDocsInterfaceDefinitionComponent
} from './interface-definition.component';

@NgModule({
  imports: [
    CommonModule,
    SkyCodeModule
  ],
  declarations: [
    SkyDocsInterfaceDefinitionComponent
  ],
  exports: [
    SkyDocsInterfaceDefinitionComponent
  ]
})
export class SkyDocsInterfaceDefinitionModule { }
