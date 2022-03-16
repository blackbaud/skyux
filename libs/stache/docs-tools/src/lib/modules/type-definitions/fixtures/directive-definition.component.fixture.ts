import { Component, ViewChild } from '@angular/core';

import { SkyDocsDirectiveDefinition } from '../directive-definition';
import { SkyDocsDirectiveDefinitionComponent } from '../directive-definition.component';

@Component({
  selector: 'sky-directive-definition-test',
  templateUrl: './directive-definition.component.fixture.html',
})
export class DirectiveDefinitionFixtureComponent {
  public config: SkyDocsDirectiveDefinition;

  @ViewChild(SkyDocsDirectiveDefinitionComponent)
  public directiveDefinitionRef: SkyDocsDirectiveDefinitionComponent;
}
