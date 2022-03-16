import { Component, ViewChild } from '@angular/core';

import { SkyDocsTypeAliasDefinition } from '../type-alias-definition';

import { SkyDocsTypeAliasDefinitionComponent } from '../type-alias-definition.component';

@Component({
  selector: 'sky-type-alias-definition-test',
  templateUrl: './type-alias-definition.component.fixture.html',
})
export class TypeAliasDefinitionFixtureComponent {
  public config: SkyDocsTypeAliasDefinition;

  @ViewChild(SkyDocsTypeAliasDefinitionComponent)
  public typeAliasDefinitionRef: SkyDocsTypeAliasDefinitionComponent;
}
