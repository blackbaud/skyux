import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDocsTypeDefinitionsModule
} from '../type-definitions.module';

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
  PropertyDefinitionsFixtureComponent
} from './property-definitions.component.fixture';

import {
  ParameterDefinitionsFixtureComponent
} from './parameter-definitions.component.fixture';

import {
  TypeAliasDefinitionFixtureComponent
} from './type-alias-definition.component.fixture';

@NgModule({
  imports: [
    CommonModule,
    SkyDocsTypeDefinitionsModule
  ],
  exports: [
    ClassDefinitionFixtureComponent,
    DirectiveDefinitionFixtureComponent,
    EnumerationDefinitionFixtureComponent,
    InterfaceDefinitionFixtureComponent,
    ParameterDefinitionsFixtureComponent,
    PropertyDefinitionsFixtureComponent,
    TypeAliasDefinitionFixtureComponent
  ],
  declarations: [
    ClassDefinitionFixtureComponent,
    DirectiveDefinitionFixtureComponent,
    EnumerationDefinitionFixtureComponent,
    InterfaceDefinitionFixtureComponent,
    ParameterDefinitionsFixtureComponent,
    PropertyDefinitionsFixtureComponent,
    TypeAliasDefinitionFixtureComponent
  ]
})
export class TypeDefinitionsFixturesModule { }
