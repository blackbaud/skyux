import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SkyLogService } from '@skyux/core';

import { SkyDefinitionListService } from './definition-list.service';

/**
 * Creates a definition list to display label-value pairs.
 * @deprecated Use `SkyDescriptionListComponent` instead.
 */
@Component({
  selector: 'sky-definition-list',
  templateUrl: './definition-list.component.html',
  styleUrls: ['./definition-list.component.scss'],
  providers: [SkyDefinitionListService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyDefinitionListComponent {
  /**
   * The width of the label portion of the definition list.
   * @default "90px"
   */
  @Input()
  public set labelWidth(value: string | undefined) {
    this.service.labelWidth.next(value);
  }

  /**
   * The default value to display when no value is provided
   * for a label-value pair.
   * @default "None found"
   */
  @Input()
  public set defaultValue(value: string | undefined) {
    this.service.defaultValue.next(value);
  }

  constructor(
    public service: SkyDefinitionListService,
    logger: SkyLogService,
  ) {
    logger.deprecated('SkyDefinitionListComponent', {
      deprecationMajorVersion: 6,
      moreInfoUrl:
        'https://developer.blackbaud.com/skyux/components/description-list',
      replacementRecommendation: 'Use `SkyDescriptionListComponent` instead.',
    });
  }
}
