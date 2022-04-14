import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SkyLogService } from '@skyux/core';

import { SkyDefinitionListService } from './definition-list.service';

/**
 * Creates a definition list to display label-value pairs.
 * @deprecated The `SkyDefinitionListComponent` is deprecated and will be removed in a future version of SKY UX.
 */
@Component({
  selector: 'sky-definition-list',
  templateUrl: './definition-list.component.html',
  styleUrls: ['./definition-list.component.scss'],
  providers: [SkyDefinitionListService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDefinitionListComponent {
  /**
   * Specifies the width of the label portion of the definition list.
   * @default "90px"
   */
  @Input()
  public set labelWidth(value: string) {
    this.service.labelWidth.next(value);
  }

  /**
   * Specifies a default value to display when no value is provided
   * for a label-value pair.
   * @default "None found"
   */
  @Input()
  public set defaultValue(value: string) {
    this.service.defaultValue.next(value);
  }

  constructor(
    public service: SkyDefinitionListService,
    logService: SkyLogService
  ) {
    logService.deprecated('SkyDefinitionListComponent', {
      replacementTypes: ['SkyDescriptionListComponent'],
    });
  }
}
