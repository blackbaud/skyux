import {
  NgModule
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyDocsDirectiveDefinitionComponent } from './directive-definition.component';
import { SkyDocsInterfaceDefinitionComponent } from './interface-definition.component';
import { SkyDocsMethodDefinitionComponent } from './method-definition.component';
import { SkyDocsMethodDefinitionParameterComponent } from './method-definition-parameter.component';
import { SkyDocsPropertyDefinitionComponent } from './property-definition.component';
import { SkyDocsPropertyDefinitionsComponent } from './property-definitions.component';
import { SkyCodeModule, SkyCodeBlockModule } from '@blackbaud/skyux-lib-code-block';

@NgModule({
  imports: [
    CommonModule,
    SkyCodeBlockModule,
    SkyCodeModule
  ],
  declarations: [
    SkyDocsDirectiveDefinitionComponent,
    SkyDocsInterfaceDefinitionComponent,
    SkyDocsMethodDefinitionComponent,
    SkyDocsMethodDefinitionParameterComponent,
    SkyDocsPropertyDefinitionComponent,
    SkyDocsPropertyDefinitionsComponent
  ],
  exports: [
    SkyDocsDirectiveDefinitionComponent,
    SkyDocsInterfaceDefinitionComponent,
    SkyDocsMethodDefinitionComponent,
    SkyDocsMethodDefinitionParameterComponent,
    SkyDocsPropertyDefinitionComponent,
    SkyDocsPropertyDefinitionsComponent
  ]
})
export class SkyDocsTypeDefinitionsModule { }
