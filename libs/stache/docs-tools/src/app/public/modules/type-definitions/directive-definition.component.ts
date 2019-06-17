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
  selector: 'sky-docs-directive-definition',
  templateUrl: './directive-definition.component.html',
  styleUrls: ['./directive-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDirectiveDefinitionComponent implements AfterContentInit {

  @Input()
  public directiveName: string;

  @Input()
  public directiveSelector: string;

  public hasPropertyDefinitions = false;

  @ContentChild(SkyDocsPropertyDefinitionsComponent)
  private propertyDefinitionsComponent: SkyDocsPropertyDefinitionsComponent;

  public ngAfterContentInit(): void {
    this.hasPropertyDefinitions = !!(this.propertyDefinitionsComponent);
  }

}
