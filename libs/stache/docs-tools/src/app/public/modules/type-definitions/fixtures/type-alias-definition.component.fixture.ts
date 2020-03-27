import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDocsTypeAliasFunctionDefinition,
  SkyDocsTypeAliasIndexSignatureDefinition,
  SkyDocsTypeAliasUnionDefinition
} from '../type-alias-definition';

import {
  SkyDocsTypeAliasDefinitionComponent
} from '../type-alias-definition.component';

@Component({
  selector: 'type-alias-definition-test',
  templateUrl: './type-alias-definition.component.fixture.html'
})
export class TypeAliasDefinitionFixtureComponent {

  public config: SkyDocsTypeAliasIndexSignatureDefinition |
    SkyDocsTypeAliasFunctionDefinition |
    SkyDocsTypeAliasUnionDefinition;

  @ViewChild(SkyDocsTypeAliasDefinitionComponent)
  public typeAliasDefinitionRef: SkyDocsTypeAliasDefinitionComponent;

}
