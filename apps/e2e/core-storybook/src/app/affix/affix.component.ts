import { Component, ViewEncapsulation, inject } from '@angular/core';
import {
  SkyAffixAutoFitContext,
  SkyAffixHorizontalAlignment,
  SkyAffixPlacement,
  SkyAffixPosition,
  SkyAffixVerticalAlignment,
} from '@skyux/core';
import { FontLoadingService } from '@skyux/storybook';

@Component({
  selector: 'app-affix',
  templateUrl: './affix.component.html',
  styleUrls: ['./affix.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AffixComponent {
  protected readonly contexts = ['none', 'overflow-hidden', 'positioned'];
  protected readonly horizontalAlignments: SkyAffixHorizontalAlignment[] = [
    'left',
    'center',
    'right',
  ];
  protected readonly placements: SkyAffixPlacement[] = [
    'above',
    // 'below',
    // 'left',
    // 'right',
  ];
  protected readonly verticalAlignments: SkyAffixVerticalAlignment[] = [
    'top',
    'middle',
    'bottom',
  ];
  protected readonly positions: SkyAffixPosition[] = ['absolute', 'fixed'];
  protected readonly autoFitContext: Record<
    'overflow' | 'viewport',
    SkyAffixAutoFitContext
  > = {
    overflow: SkyAffixAutoFitContext.OverflowParent,
    viewport: SkyAffixAutoFitContext.Viewport,
  };
  protected readonly isSticky = true;

  protected readonly ready$ = inject(FontLoadingService).ready();
}
