import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsDirectiveDefinition
} from './directive-definition';

import {
  SkyDocsPropertyDefinition
} from './property-definition';

@Component({
  selector: 'sky-docs-directive-definition',
  templateUrl: './directive-definition.component.html',
  styleUrls: ['./directive-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDirectiveDefinitionComponent {

  @Input()
  public config: SkyDocsDirectiveDefinition;

  public get inputProperties(): SkyDocsPropertyDefinition[] {
    const properties = this.config.properties || [];
    return properties.filter((property) => {
      return (property.decorator === 'Input');
    });
  }

  public get eventProperties(): SkyDocsPropertyDefinition[] {
    const properties = this.config.properties || [];
    return properties.filter((property) => {
      return (property.decorator === 'Output');
    });
  }

}
