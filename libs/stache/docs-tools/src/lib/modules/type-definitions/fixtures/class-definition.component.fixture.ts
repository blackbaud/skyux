import { Component, ViewChild } from '@angular/core';

import { SkyDocsClassDefinition } from '../class-definition';
import { SkyDocsClassDefinitionComponent } from '../class-definition.component';

@Component({
  selector: 'sky-class-definition-test',
  templateUrl: './class-definition.component.fixture.html',
})
export class ClassDefinitionFixtureComponent {
  public config: SkyDocsClassDefinition;

  @ViewChild(SkyDocsClassDefinitionComponent)
  public classDefinitionRef: SkyDocsClassDefinitionComponent;
}
