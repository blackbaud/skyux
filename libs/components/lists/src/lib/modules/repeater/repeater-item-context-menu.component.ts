import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { SkyDefaultInputProvider } from '@skyux/core';

import { Subject, takeUntil } from 'rxjs';

/**
 * Wraps and styles a
 * [`skyux-dropdown` component](https://developer.blackbaud.com/skyux-popovers/docs/dropdown).
 */
@Component({
  selector: 'sky-repeater-item-context-menu',
  templateUrl: './repeater-item-context-menu.component.html',
  providers: [SkyDefaultInputProvider],
})
/* istanbul ignore next */
/* Code coverage having problems with no statements in classes */
export class SkyRepeaterItemContextMenuComponent implements OnDestroy {
  #parentDefaultInputProvider = inject(SkyDefaultInputProvider, {
    skipSelf: true,
  });
  #childDefaultInputProvider = inject(SkyDefaultInputProvider, { self: true });
  #changeDetector = inject(ChangeDetectorRef);
  #ngUnsubscribe = new Subject<void>();

  constructor() {
    this.#parentDefaultInputProvider
      .getValue('repeaterItemContextMenu', 'ariaLabel')
      ?.pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((ariaLabel) => {
        this.#childDefaultInputProvider.setValue(
          'dropdown',
          'label',
          ariaLabel
        );
        this.#changeDetector.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}
