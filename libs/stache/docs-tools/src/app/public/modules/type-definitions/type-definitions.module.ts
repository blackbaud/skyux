import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  RouterModule
} from '@angular/router';

import {
  SkyCodeBlockModule,
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyMediaQueryModule
} from '@skyux/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyDefinitionListModule
} from '@skyux/layout';

import {
  SkyDocsHeadingAnchorModule
} from '../heading-anchor/heading-anchor.module';

import {
  SkyDocsMarkdownModule
} from '../markdown/markdown.module';

import {
  SkyDocsSafeHtmlModule
} from '../safe-html/safe-html.module';

import {
  SkyDocsAnchorLinkService
} from './anchor-link.service';

import {
  SkyDocsDirectiveDefinitionComponent
} from './directive-definition.component';

import {
  SkyDocsEnumerationDefinitionComponent
} from './enumeration-definition.component';

import {
  SkyDocsInterfaceDefinitionComponent
} from './interface-definition.component';

import {
  SkyDocsParameterDefinitionComponent
} from './parameter-definition.component';

import {
  SkyDocsParameterDefinitionsComponent
} from './parameter-definitions.component';

import {
  SkyDocsPipeDefinitionComponent
} from './pipe-definition.component';

import {
  SkyDocsPropertyDefinitionComponent
} from './property-definition.component';

import {
  SkyDocsPropertyDefinitionsComponent
} from './property-definitions.component';

import {
  SkyDocsServiceDefinitionComponent
} from './service-definition.component';

import {
  SkyDocsTypeAliasDefinitionComponent
} from './type-alias-definition.component';

import {
  SkyDocsTypeDefinitionsFormatService
} from './type-definitions-format.service';

import {
  SkyDocsTypeDefinitionsService
} from './type-definitions.service';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SkyCodeBlockModule,
    SkyCodeModule,
    SkyDefinitionListModule,
    SkyDocsHeadingAnchorModule,
    SkyDocsMarkdownModule,
    SkyDocsSafeHtmlModule,
    SkyIconModule,
    SkyMediaQueryModule
  ],
  declarations: [
    SkyDocsDirectiveDefinitionComponent,
    SkyDocsEnumerationDefinitionComponent,
    SkyDocsInterfaceDefinitionComponent,
    SkyDocsParameterDefinitionComponent,
    SkyDocsParameterDefinitionsComponent,
    SkyDocsPipeDefinitionComponent,
    SkyDocsPropertyDefinitionComponent,
    SkyDocsPropertyDefinitionsComponent,
    SkyDocsServiceDefinitionComponent,
    SkyDocsTypeAliasDefinitionComponent
  ],
  exports: [
    SkyDocsDirectiveDefinitionComponent,
    SkyDocsEnumerationDefinitionComponent,
    SkyDocsInterfaceDefinitionComponent,
    SkyDocsParameterDefinitionComponent,
    SkyDocsParameterDefinitionsComponent,
    SkyDocsPipeDefinitionComponent,
    SkyDocsPropertyDefinitionComponent,
    SkyDocsPropertyDefinitionsComponent,
    SkyDocsServiceDefinitionComponent,
    SkyDocsTypeAliasDefinitionComponent
  ],
  providers: [
    SkyDocsAnchorLinkService,
    SkyDocsTypeDefinitionsFormatService,
    SkyDocsTypeDefinitionsProvider,
    SkyDocsTypeDefinitionsService
  ]
})
export class SkyDocsTypeDefinitionsModule { }
