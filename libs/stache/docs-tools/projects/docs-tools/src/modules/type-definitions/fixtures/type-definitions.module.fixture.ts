import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  SkyDocsTypeDefinitionsModule
} from '../type-definitions.module';

import {
  CallSignatureDefinitionFixtureComponent
} from './call-signature-definition.component.fixture';

import {
  ClassDefinitionFixtureComponent
} from './class-definition.component.fixture';

import {
  DirectiveDefinitionFixtureComponent
} from './directive-definition.component.fixture';

import {
  EnumerationDefinitionFixtureComponent
} from './enumeration-definition.component.fixture';

import {
  InterfaceDefinitionFixtureComponent
} from './interface-definition.component.fixture';

import {
  MethodDefinitionsFixtureComponent
} from './method-definitions.component.fixture';

import {
  PropertyDefinitionsFixtureComponent
} from './property-definitions.component.fixture';

import {
  TypeAliasDefinitionFixtureComponent
} from './type-alias-definition.component.fixture';

import {
  TypeAnchorLinksPipeFixtureComponent
} from './type-anchor-links.pipe.component.fixture';

@NgModule({
  imports: [
    CommonModule,
    RouterTestingModule,
    SkyDocsTypeDefinitionsModule
  ],
  exports: [
    CallSignatureDefinitionFixtureComponent,
    ClassDefinitionFixtureComponent,
    DirectiveDefinitionFixtureComponent,
    EnumerationDefinitionFixtureComponent,
    InterfaceDefinitionFixtureComponent,
    MethodDefinitionsFixtureComponent,
    PropertyDefinitionsFixtureComponent,
    TypeAliasDefinitionFixtureComponent,
    TypeAnchorLinksPipeFixtureComponent
  ],
  declarations: [
    CallSignatureDefinitionFixtureComponent,
    ClassDefinitionFixtureComponent,
    DirectiveDefinitionFixtureComponent,
    EnumerationDefinitionFixtureComponent,
    InterfaceDefinitionFixtureComponent,
    MethodDefinitionsFixtureComponent,
    PropertyDefinitionsFixtureComponent,
    TypeAliasDefinitionFixtureComponent,
    TypeAnchorLinksPipeFixtureComponent
  ]
})
export class TypeDefinitionsFixturesModule { }
