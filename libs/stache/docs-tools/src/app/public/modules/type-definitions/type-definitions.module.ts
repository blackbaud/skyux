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
import { SkyDocsPipeDefinitionComponent } from './pipe-definition.component';
import { SkyDocsServiceDefinitionComponent } from './service-definition.component';
import { SkyIconModule } from '@skyux/indicators';
import { RouterModule } from '@angular/router';
import { SkyDocsSectionAnchorModule } from '../section-anchor/section-anchor.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SkyCodeBlockModule,
    SkyCodeModule,
    SkyDocsMarkdownModule,
    SkyIconModule,
    SkyDocsSectionAnchorModule
  ],
  declarations: [
    SkyDocsDirectiveDefinitionComponent,
    SkyDocsInterfaceDefinitionComponent,
    SkyDocsMethodDefinitionComponent,
    SkyDocsParameterDefinitionComponent,
    SkyDocsParameterDefinitionsComponent,
    SkyDocsPipeDefinitionComponent,
    SkyDocsPropertyDefinitionComponent,
    SkyDocsPropertyDefinitionsComponent,
    SkyDocsServiceDefinitionComponent
  ],
  exports: [
    SkyDocsDirectiveDefinitionComponent,
    SkyDocsInterfaceDefinitionComponent,
    SkyDocsMethodDefinitionComponent,
    SkyDocsParameterDefinitionComponent,
    SkyDocsParameterDefinitionsComponent,
    SkyDocsPipeDefinitionComponent,
    SkyDocsPropertyDefinitionComponent,
    SkyDocsPropertyDefinitionsComponent,
    SkyDocsServiceDefinitionComponent
  ],
  providers: [
    SkyDocsTypeDefinitionsProvider,
    SkyDocsTypeDefinitionsService
  ]
})
export class SkyDocsTypeDefinitionsModule { }
