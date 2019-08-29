import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsTypeAliasDefinition
} from './type-definitions';

@Component({
  selector: 'sky-docs-type-alias-definition',
  templateUrl: './type-alias-definition.component.html',
  styleUrls: ['./type-alias-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsTypeAliasDefinitionComponent {

  @Input()
  public config: SkyDocsTypeAliasDefinition;

}
