import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input
} from '@angular/core';

import {
  SkyDocsPropertyDefinitionsComponent
} from './property-definitions.component';

@Component({
  selector: 'sky-docs-interface-definition',
  templateUrl: './interface-definition.component.html',
  styleUrls: ['./interface-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsInterfaceDefinitionComponent implements AfterContentInit {

  @Input()
  public interfaceName: string;

  @Input()
  public sourceCode: string;

  public hasProperties: boolean = false;

  @ContentChild(SkyDocsPropertyDefinitionsComponent)
  private propertyDefinitions: SkyDocsPropertyDefinitionsComponent;

  public ngAfterContentInit(): void {
    this.hasProperties = !!(this.propertyDefinitions);
  }

}
