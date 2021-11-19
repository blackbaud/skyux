import { Component, Input } from '@angular/core';
import { SkyFluidGridGutterSizeType } from '@skyux/layout';

import { SkyActionHubNeedsAttention } from '../action-hub/types/action-hub-needs-attention';

@Component({
  selector: 'sky-needs-attention',
  templateUrl: './needs-attention.component.html',
  styleUrls: ['./needs-attention.component.scss'],
})
export class SkyNeedsAttentionComponent {
  @Input()
  public items: SkyActionHubNeedsAttention[];

  public readonly gutterSize: SkyFluidGridGutterSizeType = 'large';
}
