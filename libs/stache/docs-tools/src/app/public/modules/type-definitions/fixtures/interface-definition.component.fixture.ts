import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDocsInterfaceDefinition
} from '../interface-definition';

import {
  SkyDocsInterfaceDefinitionComponent
} from '../interface-definition.component';

@Component({
  selector: 'interface-definition-test',
  templateUrl: './interface-definition.component.fixture.html'
})
export class InterfaceDefinitionFixtureComponent {

  public config: SkyDocsInterfaceDefinition;

  @ViewChild(SkyDocsInterfaceDefinitionComponent)
  public interfaceDefinitionRef: SkyDocsInterfaceDefinitionComponent;

}
