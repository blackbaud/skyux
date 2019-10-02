import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsPipeDefinition
} from './type-definitions';

@Component({
  selector: 'sky-docs-pipe-definition',
  templateUrl: './pipe-definition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsPipeDefinitionComponent {

  @Input()
  public config: SkyDocsPipeDefinition;

}
