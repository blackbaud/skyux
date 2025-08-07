import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkyDefinitionListService } from './definition-list.service';

/**
 * Specifies the label in a label-value pair.
 * @deprecated Use `SkyDescriptionListTermComponent` instead.
 */
@Component({
  selector: 'sky-definition-list-label',
  templateUrl: './definition-list-label.component.html',
  styleUrls: ['./definition-list-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyDefinitionListLabelComponent {
  public labelWidth: number | undefined;

  constructor(public service: SkyDefinitionListService) {}
}
