import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SkyDefinitionListService } from './definition-list.service';

/**
 * Specifies the value in a label-value pair.
 * @deprecated Use `SkyDescriptionListDescriptionComponent` instead.
 */
@Component({
  selector: 'sky-definition-list-value',
  templateUrl: './definition-list-value.component.html',
  styleUrls: ['./definition-list-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyDefinitionListValueComponent {
  public defaultValue: string | undefined;

  public readonly service = inject(SkyDefinitionListService);
}
