import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyCodeBlockModule,
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import { SkyDocsDirectiveDefinitionComponent } from './directive-definition.component';
import { SkyDocsInterfaceDefinitionComponent } from './interface-definition.component';
import { SkyDocsMethodDefinitionComponent } from './method-definition.component';
import { SkyDocsPropertyDefinitionComponent } from './property-definition.component';
import { SkyDocsPropertyDefinitionsComponent } from './property-definitions.component';
import { SkyDocsParameterDefinitionComponent } from './parameter-definition.component';
import { SkyDocsParameterDefinitionsComponent } from './parameter-definitions.component';
import { SkyDocsMarkdownModule } from '../markdown/markdown.module';
import { SkyDocsTypeDefinitionsService } from './type-definitions.service';
import { SkyDocsTypeDefinitionsProvider } from './type-definitions-provider';

@NgModule({
  imports: [
    CommonModule,
    SkyCodeBlockModule,
    SkyCodeModule,
    SkyDocsMarkdownModule
  ],
  declarations: [
    SkyDocsDirectiveDefinitionComponent,
    SkyDocsInterfaceDefinitionComponent,
    SkyDocsMethodDefinitionComponent,
    SkyDocsParameterDefinitionComponent,
    SkyDocsParameterDefinitionsComponent,
    SkyDocsPropertyDefinitionComponent,
    SkyDocsPropertyDefinitionsComponent
  ],
  exports: [
    SkyDocsDirectiveDefinitionComponent,
    SkyDocsInterfaceDefinitionComponent,
    SkyDocsMethodDefinitionComponent,
    SkyDocsParameterDefinitionComponent,
    SkyDocsParameterDefinitionsComponent,
    SkyDocsPropertyDefinitionComponent,
    SkyDocsPropertyDefinitionsComponent
  ],
  providers: [
    SkyDocsTypeDefinitionsProvider,
    SkyDocsTypeDefinitionsService
  ]
})
export class SkyDocsTypeDefinitionsModule { }
