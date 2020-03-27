import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDocsParameterDefinitionComponent
} from '../parameter-definition.component';

import {
  SkyDocsParameterDefinitionsComponent
} from '../parameter-definitions.component';

@Component({
  selector: 'parameter-definition-test',
  templateUrl: './parameter-definitions.component.fixture.html'
})
export class ParameterDefinitionsFixtureComponent {

  public defaultValue: string;

  public description: string;

  public isOptional: boolean;

  public parameterName: string;

  public parameterType: string;

  @ViewChild(SkyDocsParameterDefinitionComponent)
  public parameterDefinitionRef: SkyDocsParameterDefinitionComponent;

  @ViewChild(SkyDocsParameterDefinitionsComponent)
  public parameterDefinitionsRef: SkyDocsParameterDefinitionsComponent;

}
