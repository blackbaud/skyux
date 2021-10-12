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
  SkyDocsCallSignatureDefinitionComponent
} from './call-signature-definition.component';

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
  SkyDocsMethodDefinitionsComponent
} from './method-definitions.component';

import {
  SkyDocsPipeDefinitionComponent
} from './pipe-definition.component';

import {
  SkyDocsPropertyDefinitionsComponent
} from './property-definitions.component';

import {
  SkyDocsClassDefinitionComponent
} from './class-definition.component';

import {
  SkyDocsTypeAliasDefinitionComponent
} from './type-alias-definition.component';

import {
  SkyDocsTypeAnchorLinksPipe
} from './type-anchor-links.pipe';

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
    SkyIconModule
  ],
  declarations: [
    SkyDocsCallSignatureDefinitionComponent,
    SkyDocsClassDefinitionComponent,
    SkyDocsDirectiveDefinitionComponent,
    SkyDocsEnumerationDefinitionComponent,
    SkyDocsInterfaceDefinitionComponent,
    SkyDocsMethodDefinitionsComponent,
    SkyDocsPipeDefinitionComponent,
    SkyDocsPropertyDefinitionsComponent,
    SkyDocsTypeAliasDefinitionComponent,
    SkyDocsTypeAnchorLinksPipe
  ],
  exports: [
    SkyDocsCallSignatureDefinitionComponent,
    SkyDocsClassDefinitionComponent,
    SkyDocsDirectiveDefinitionComponent,
    SkyDocsEnumerationDefinitionComponent,
    SkyDocsInterfaceDefinitionComponent,
    SkyDocsMethodDefinitionsComponent,
    SkyDocsPipeDefinitionComponent,
    SkyDocsPropertyDefinitionsComponent,
    SkyDocsTypeAliasDefinitionComponent,
    SkyDocsTypeAnchorLinksPipe
  ]
})
export class SkyDocsTypeDefinitionsModule { }
