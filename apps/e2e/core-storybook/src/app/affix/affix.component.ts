import {
  Component,
  HostBinding,
  ViewEncapsulation,
  input,
} from '@angular/core';
import {
  SkyAffixAutoFitContext,
  SkyAffixHorizontalAlignment,
  SkyAffixPlacement,
  SkyAffixPosition,
  SkyAffixVerticalAlignment,
} from '@skyux/core';

@Component({
  selector: 'app-affix',
  templateUrl: './affix.component.html',
  styleUrls: ['./affix.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class AffixComponent {
  public readonly wide = input<boolean>(true);

  @HostBinding('style.width')
  public get wideStyle(): string {
    return this.wide() ? '200vw' : 'auto';
  }

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
}
