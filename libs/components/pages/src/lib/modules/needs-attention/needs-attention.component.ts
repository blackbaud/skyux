import { Component, Input, inject } from '@angular/core';
import { SkyLogService } from '@skyux/core';

import { SkyActionHubNeedsAttention } from '../action-hub/types/action-hub-needs-attention';

@Component({
  selector: 'sky-needs-attention',
  templateUrl: './needs-attention.component.html',
  styleUrls: ['./needs-attention.component.scss'],
  standalone: false,
})
export class SkyNeedsAttentionComponent {
  @Input()
  public set items(value: SkyActionHubNeedsAttention[] | undefined) {
    this.#items = value;
    if (value?.some((c: SkyActionHubNeedsAttention) => c.message)) {
      this.#logService.deprecated(`SkyActionHubNeedsAttention.message`, {
        deprecationMajorVersion: 7,
        replacementRecommendation: 'Use `title` instead.',
        moreInfoUrl:
          'https://developer.blackbaud.com/skyux/components/action-hub?docs-active-tab=development#interface-skyactionhubneedsattention',
      });
    }
  }
  public get items(): SkyActionHubNeedsAttention[] | undefined {
    return this.#items;
  }

  #items: SkyActionHubNeedsAttention[] | undefined;
  #logService = inject(SkyLogService);
}
