import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SkyDocsDirectiveDefinition } from './directive-definition';

@Component({
  selector: 'sky-docs-directive-definition',
  templateUrl: './directive-definition.component.html',
  styleUrls: ['./directive-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsDirectiveDefinitionComponent {
  @Input()
  public config: SkyDocsDirectiveDefinition;
}
