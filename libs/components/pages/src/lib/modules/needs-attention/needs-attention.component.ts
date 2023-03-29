import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';
import { SkyFluidGridGutterSizeType } from '@skyux/layout';

import { SkyActionHubNeedsAttention } from '../action-hub/types/action-hub-needs-attention';

@Component({
  selector: 'sky-needs-attention',
  templateUrl: './needs-attention.component.html',
  styleUrls: ['./needs-attention.component.scss'],
})
export class SkyNeedsAttentionComponent implements OnChanges {
  @Input()
  public items: SkyActionHubNeedsAttention[] | undefined;

  public readonly gutterSize: SkyFluidGridGutterSizeType = 'large';

  #logService = inject(SkyLogService);
  #haveLoggedDeprecationWarning = false;

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.#haveLoggedDeprecationWarning &&
      changes.items?.currentValue?.some(
        (c: SkyActionHubNeedsAttention) => c.message
      )
    ) {
      this.#logService.deprecated(`SkyActionHubNeedsAttention.message`, {
        deprecationMajorVersion: 7,
        replacementRecommendation: 'Use `title` instead.',
        moreInfoUrl:
          'https://developer.blackbaud.com/skyux/components/action-hub?docs-active-tab=development#interface-skyactionhubneedsattention',
      });
      this.#haveLoggedDeprecationWarning = true;
    }
  }
}
