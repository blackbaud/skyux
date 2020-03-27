import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDocsPropertyDecorator
} from '../property-decorator';

import {
  SkyDocsPropertyDefinitionComponent
} from '../property-definition.component';

import {
  SkyDocsPropertyDefinitionsComponent
} from '../property-definitions.component';

@Component({
  selector: 'property-definition-test',
  templateUrl: './property-definitions.component.fixture.html'
})
export class PropertyDefinitionsFixtureComponent {

  public defaultValue: string;

  public deprecationWarning: string;

  public isOptional: boolean;

  public propertyDecorator: SkyDocsPropertyDecorator;

  public propertyName: string;

  public propertyType: string;

  public description: string;

  @ViewChild(SkyDocsPropertyDefinitionComponent)
  public propertyDefinitionRef: SkyDocsPropertyDefinitionComponent;

  @ViewChild(SkyDocsPropertyDefinitionsComponent)
  public propertyDefinitionsRef: SkyDocsPropertyDefinitionsComponent;

}
