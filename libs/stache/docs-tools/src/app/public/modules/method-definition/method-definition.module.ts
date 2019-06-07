import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import { SkyCodeModule, SkyCodeBlockModule } from '@blackbaud/skyux-lib-code-block';

import { SkyDocsMethodDefinitionComponent } from './method-definition.component';
import { SkyDocsMethodDefinitionParameterComponent } from './method-definition-parameter.component';

@NgModule({
  imports: [
    CommonModule,
    SkyCodeBlockModule,
    SkyCodeModule
  ],
  declarations: [
    SkyDocsMethodDefinitionComponent,
    SkyDocsMethodDefinitionParameterComponent
  ],
  exports: [
    SkyDocsMethodDefinitionComponent,
    SkyDocsMethodDefinitionParameterComponent
  ]
})
export class SkyDocsMethodDefinitionModule { }
