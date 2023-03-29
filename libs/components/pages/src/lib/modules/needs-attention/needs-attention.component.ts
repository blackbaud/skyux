import { Component, Input, inject } from '@angular/core';
import { SkyLogService } from '@skyux/core';
import { SkyFluidGridGutterSizeType } from '@skyux/layout';

import { SkyActionHubNeedsAttention } from '../action-hub/types/action-hub-needs-attention';

@Component({
  selector: 'sky-needs-attention',
  templateUrl: './needs-attention.component.html',
  styleUrls: ['./needs-attention.component.scss'],
})
export class SkyNeedsAttentionComponent {
  @Input()
  public set items(value: SkyActionHubNeedsAttention[] | undefined) {
    this.#items = value;
    if (
      !this.#haveLoggedDeprecationWarning &&
      value?.some((c: SkyActionHubNeedsAttention) => c.message)
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
  public get items(): SkyActionHubNeedsAttention[] | undefined {
    return this.#items;
  }

  public readonly gutterSize: SkyFluidGridGutterSizeType = 'large';

  #haveLoggedDeprecationWarning = false;
  #items: SkyActionHubNeedsAttention[] | undefined;
  #logService = inject(SkyLogService);
}
