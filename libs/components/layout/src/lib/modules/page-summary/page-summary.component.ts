import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  ElementRef,
  QueryList,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
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
})
export class SkyPageSummaryComponent implements AfterContentInit {
  public hasKeyInfo = false;

  @ContentChildren(SkyPageSummaryKeyInfoComponent, {
    read: SkyPageSummaryKeyInfoComponent,
  })
  public keyInfoComponents:
    | QueryList<SkyPageSummaryKeyInfoComponent>
    | undefined;

  #elRef: ElementRef;
  #adapter: SkyPageSummaryAdapterService;
  #changeDetectorRef: ChangeDetectorRef;

  readonly #destroyRef = inject(DestroyRef);
  readonly #breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );

  constructor(
    elRef: ElementRef,
    adapter: SkyPageSummaryAdapterService,
    logger: SkyLogService,
    changeDetector: ChangeDetectorRef,
  ) {
    this.#elRef = elRef;
    this.#adapter = adapter;
    this.#changeDetectorRef = changeDetector;

    logger.deprecated('SkyPageSummaryComponent', {
      deprecationMajorVersion: 6,
      moreInfoUrl:
        'https://developer.blackbaud.com/skyux/design/guidelines/page-layouts',
      replacementRecommendation:
        'For page templates and techniques to summarize page content, see the page design guidelines.',
    });

    effect(() => {
      this.#adapter.updateKeyInfoLocation(
        this.#elRef,
        this.#breakpoint() === 'xs',
      );
    });
  }

  public ngAfterContentInit(): void {
    if (this.keyInfoComponents) {
      this.hasKeyInfo = this.keyInfoComponents.length > 0;

      this.keyInfoComponents.changes
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => {
          this.hasKeyInfo =
            !!this.keyInfoComponents && this.keyInfoComponents.length > 0;
          this.#changeDetectorRef.markForCheck();
        });
    }
  }
}
