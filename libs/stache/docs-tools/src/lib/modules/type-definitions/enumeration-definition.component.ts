import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SkyDocsEnumerationDefinition } from './enumeration-definition';

@Component({
  selector: 'sky-docs-enumeration-definition',
  templateUrl: './enumeration-definition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsEnumerationDefinitionComponent {
  @Input()
  public config: SkyDocsEnumerationDefinition;
}
