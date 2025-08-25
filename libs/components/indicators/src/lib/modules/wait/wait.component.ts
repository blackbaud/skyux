import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import {
  SkyLiveAnnouncerService,
  SkyStackingContextService,
  SkyStackingContextStratum,
} from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';

import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyWaitAdapterService } from './wait-adapter.service';

let nextId = 0;

@Component({
  selector: 'sky-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.scss'],
  providers: [SkyWaitAdapterService],
  imports: [CommonModule, SkyIndicatorsResourcesModule],
})
export class SkyWaitComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * The ARIA label for the wait icon.
   * This sets the icon's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility) when an element or page loads and when users tab to a wait icon.
   * The default value varies based on whether the wait is for an element or a page and whether it is a blocking wait. For example, the default for a page-level blocking wait is "Page loading. Please wait."
   * For element-level waits, we recommend that consumers overwrite the default to describe the specific element.
   * "For more information, see the Design tab and the [WAI-ARIA `aria-label` definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public set ariaLabel(value: string | undefined) {
    this.#customAriaLabel = value;
    this.#publishAriaLabel();
  }

  /**
   * When set to `true`, wait indication appears on the parent element of the `sky-wait` component.
   */
  @Input()
  public set isWaiting(value: boolean | undefined) {
    if (!this.isFullPage) {
      if (value) {
        this.#adapterService.setWaitBounds(this.#elRef);
      } else {
        this.#adapterService.removeWaitBounds(this.#elRef);
      }
    }

    this.#adapterService.setBusyState(
      this.#elRef,
      !!this.isFullPage,
      !!value,
      !!this.isNonBlocking,
      this.#id,
    );

    if (value) {
      this.#liveAnnouncer.announce(this.ariaLabelStream.getValue());
    } else if (this.#_isWaiting) {
      // NOTE: This should only happen if the wait was previously waiting and no longer is waiting.
      this.#liveAnnouncer.announce(
        this.screenReaderCompletedTextStream.getValue(),
      );
    }

    this.#_isWaiting = value;
  }

  public get isWaiting(): boolean | undefined {
    return this.#_isWaiting;
  }

  /**
   * When set to `true`, wait indication appears on the page level instead of the
   * parent element level. We recommend that you use the `beginBlockingPageWait` or
   * `beginNonBlockingPageWait` functions of the `SkyWaitService` instead of setting this
   * on the component level.
   * @default false
   */
  @Input()
  public set isFullPage(value: boolean | undefined) {
    /* istanbul ignore else: untestable */
    if (value) {
      this.#adapterService.removeWaitBounds(this.#elRef);
    } else if (this.isWaiting) {
      this.#adapterService.setWaitBounds(this.#elRef);
    }

    this.#_isFullPage = value;
    this.#publishAriaLabel();
    this.#publishScreenReaderCompletedText();
  }

  public get isFullPage(): boolean | undefined {
    return this.#_isFullPage;
  }

  /**
   * When set to `true`, wait indication appears in the bottom left corner of the element
   * instead of hiding the entire parent element.
   * @default false
   */
  @Input()
  public set isNonBlocking(value: boolean | undefined) {
    this.#_isNonBlocking = value;
    this.#publishAriaLabel();
  }

  public get isNonBlocking(): boolean | undefined {
    return this.#_isNonBlocking;
  }

  /**
   * Screen reader text [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility) when the wait toggles off.
   *  The default varies based on whether the wait is for an element or a page.
   * For example, the default for a page-level wait is "Page loading complete."
   * For element-level waits, we recommend that consumers overwrite the default to describe the specific element.
   * For more information, see the Design tab and the [WCAG documentation on status messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html).
   */
  @Input()
  public set screenReaderCompletedText(value: string | undefined) {
    this.#customScreenReaderCompletedText = value;
    this.#publishScreenReaderCompletedText();
  }

  public ariaLabelStream = new BehaviorSubject<string>('');
  public ariaLiveText = '';
  public screenReaderCompletedTextStream = new BehaviorSubject<string>('');

  protected readonly zIndex = signal<number | undefined>(undefined);

  #customAriaLabel: string | undefined;
  #customScreenReaderCompletedText: string | undefined;
  #id = `sky-wait-${++nextId}`;
  #ngUnsubscribe = new Subject<void>();

  #_isFullPage: boolean | undefined;
  #_isNonBlocking: boolean | undefined;
  #_isWaiting: boolean | undefined;

  readonly #adapterService = inject(SkyWaitAdapterService);
  readonly #elRef = inject(ElementRef);
  readonly #liveAnnouncer = inject(SkyLiveAnnouncerService);
  readonly #resourceSvc = inject(SkyLibResourcesService);
  readonly #stackingContextService = inject(SkyStackingContextService);
  readonly #stackingContextStratum = inject(SkyStackingContextStratum);
  #pageWaitZIndex: number | undefined;
  #blockWaitZIndex: number | undefined;

  public ngOnInit(): void {
    this.#publishAriaLabel();
    this.#publishScreenReaderCompletedText();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    if (this.#pageWaitZIndex !== undefined) {
      this.#stackingContextService.unsetZIndex(this.#pageWaitZIndex);
    }
    if (this.#blockWaitZIndex !== undefined) {
      this.#stackingContextService.unsetZIndex(this.#blockWaitZIndex);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      'isFullPage' in changes ||
      'isNonBlocking' in changes ||
      'isWaiting' in changes
    ) {
      this.#updateZIndex();
    }
  }

  #publishAriaLabel(): void {
    if (this.#customAriaLabel) {
      this.ariaLabelStream.next(this.#customAriaLabel);
    } else {
      const type = this.isFullPage ? '_page' : '';
      const blocking = this.isNonBlocking ? '' : '_blocking';
      const key = `skyux_wait${type}${blocking}_aria_alt_text`;
      this.#resourceSvc
        .getString(key)
        .pipe(take(1), takeUntil(this.#ngUnsubscribe))
        .subscribe((value) => {
          this.ariaLabelStream.next(value);
        });
    }
  }

  #publishScreenReaderCompletedText(): void {
    if (this.#customScreenReaderCompletedText) {
      this.screenReaderCompletedTextStream.next(
        this.#customScreenReaderCompletedText,
      );
    } else {
      const type = this.isFullPage ? '_page' : '';
      const key = `skyux_wait${type}_screen_reader_completed_text`;
      this.#resourceSvc
        .getString(key)
        .pipe(take(1), takeUntil(this.#ngUnsubscribe))
        .subscribe((value) => {
          this.screenReaderCompletedTextStream.next(value);
        });
    }
  }

  #updateZIndex(): void {
    if (this.isWaiting && !this.isNonBlocking) {
      if (this.isFullPage) {
        this.#pageWaitZIndex ??=
          this.#stackingContextService.getZIndex('page-wait');
        this.zIndex.set(this.#pageWaitZIndex);
      } else {
        this.#blockWaitZIndex ??= this.#stackingContextService.getZIndex(
          this.#stackingContextStratum,
        );
        this.zIndex.set(this.#blockWaitZIndex);
      }
    } else {
      this.zIndex.set(undefined);
    }
  }
}
