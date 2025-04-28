import {
  Component,
  ElementRef,
  contentChildren,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyLogService, SkyMediaQueryService } from '@skyux/core';

import { SkyPageSummaryAdapterService } from './page-summary-adapter.service';
import { SkyPageSummaryKeyInfoComponent } from './page-summary-key-info.component';

/**
 * Specifies the components to display in the page summary.
 * @deprecated `SkyPageSummaryComponent` is deprecated. For page templates and techniques to summarize page content, see the page design guidelines. For more information, see https://developer.blackbaud.com/skyux/design/guidelines/page-layouts.
 */
@Component({
  selector: 'sky-page-summary',
  templateUrl: './page-summary.component.html',
  styleUrls: ['./page-summary.component.scss'],
  providers: [SkyPageSummaryAdapterService],
  standalone: false,
})
export class SkyPageSummaryComponent {
  protected keyInfoComponents = contentChildren(SkyPageSummaryKeyInfoComponent);

  readonly #breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );

  constructor() {
    const adapter = inject(SkyPageSummaryAdapterService);
    const elRef = inject(ElementRef);

    inject(SkyLogService).deprecated('SkyPageSummaryComponent', {
      deprecationMajorVersion: 6,
      moreInfoUrl:
        'https://developer.blackbaud.com/skyux/design/guidelines/page-layouts',
      replacementRecommendation:
        "We recommend using the page component's `sky-page-header` component instead. And for page templates and techniques to summarize page content, see the page design guidelines.",
    });

    effect(() => {
      adapter.updateKeyInfoLocation(elRef, this.#breakpoint() === 'xs');
    });
  }
}
