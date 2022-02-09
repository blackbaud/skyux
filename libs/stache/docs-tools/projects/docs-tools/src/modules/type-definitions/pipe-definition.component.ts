import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SkyDocsPipeDefinition } from './pipe-definition';

@Component({
  selector: 'sky-docs-pipe-definition',
  templateUrl: './pipe-definition.component.html',
  styleUrls: ['./pipe-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsPipeDefinitionComponent {
  @Input()
  public config: SkyDocsPipeDefinition;
}
