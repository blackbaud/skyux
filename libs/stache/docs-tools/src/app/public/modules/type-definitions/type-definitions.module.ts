import {
  NgModule
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyDocsDirectiveDefinitionComponent } from './directive-definition.component';
import { SkyDocsInterfaceDefinitionComponent } from './interface-definition.component';
import { SkyDocsMethodDefinitionComponent } from './method-definition.component';
import { SkyDocsPropertyDefinitionComponent } from './property-definition.component';
import { SkyDocsPropertyDefinitionsComponent } from './property-definitions.component';
import { SkyCodeModule, SkyCodeBlockModule } from '@blackbaud/skyux-lib-code-block';
import { SkyDocsParameterDefinitionComponent } from './parameter-definition.component';
import { SkyDocsParameterDefinitionsComponent } from './parameter-definitions.component';
import { SkyDocsMarkdownModule } from '../markdown/markdown.module';

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
  ]
})
export class SkyDocsTypeDefinitionsModule { }
