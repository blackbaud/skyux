import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  AfterViewInit
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
export class SkyDocsDirectiveDefinitionComponent implements AfterViewInit {

  @Input()
  public directiveName: string;

  @Input()
  public directiveSelector: string;

  public hasPropertyDefinitions = false;

  @ViewChild(SkyDocsPropertyDefinitionsComponent)
  private propertyDefinitionsComponent: SkyDocsPropertyDefinitionsComponent;

  public ngAfterViewInit(): void {
    this.hasPropertyDefinitions = !!(this.propertyDefinitionsComponent);
  }

}
