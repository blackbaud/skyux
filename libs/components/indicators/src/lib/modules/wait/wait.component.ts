import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { BehaviorSubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkyWaitAdapterService } from './wait-adapter.service';

let nextId = 0;

@Component({
  selector: 'sky-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.scss'],
  providers: [SkyWaitAdapterService],
})
export class SkyWaitComponent implements OnInit, OnDestroy {
  /**
   * Specifies an ARIA label for the wait icon while an element or page loads.
   * This sets the icon's `aria-label` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * The default value varies based on whether the wait is for an element or a page
   * and whether it is a blocking wait. For example, the default for a page-blocking
   * wait is "Page loading. Please wait." This value is also announced to users of screen reader technologies when the wait is activated.
   * In most cases, it is recommended that consumers provide more specific text based on individual use cases. For more information, see the Design tab.
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
      this.#id
    );

    if (value) {
      this.#liveAnnouncer.announce(this.ariaLabelStream.getValue());
    } else if (this.#_isWaiting) {
      // NOTE: This should only happen if the wait was previously waiting and no longer is waiting.
      this.#liveAnnouncer.announce(
        this.screenReaderCompletedTextStream.getValue()
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
   * Specifies screen reader text which is read when the wait is toggled off.
   * This is done [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility). The default value varies based on whether the wait is for an element or a page.
   * For example, the default for a page wait is "Page loading complete." In most cases, it is recommended that consumers provide more specific text based on individual use cases.
   * For more information, see the Design tab and the [WCAG documentation on status messages}(https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html).
   */
  @Input()
  public set screenReaderCompletedText(value: string | undefined) {
    this.#customScreenReaderCompletedText = value;
    this.#publishScreenReaderCompletedText();
  }

  public ariaLabelStream = new BehaviorSubject<string>('');
  public screenReaderCompletedTextStream = new BehaviorSubject<string>('');

  #elRef: ElementRef;
  #adapterService: SkyWaitAdapterService;
  #liveAnnouncer: LiveAnnouncer;
  #resourceSvc: SkyLibResourcesService;
  #ngUnsubscribe = new Subject<void>();

  #id: string;
  #customAriaLabel: string | undefined;
  #customScreenReaderCompletedText: string | undefined;

  #_isFullPage: boolean | undefined;
  #_isNonBlocking: boolean | undefined;
  #_isWaiting: boolean | undefined;

  constructor(
    elRef: ElementRef,
    adapterService: SkyWaitAdapterService,
    liveAnnouncer: LiveAnnouncer,
    @Optional() resourceSvc: SkyLibResourcesService
  ) {
    this.#elRef = elRef;
    this.#adapterService = adapterService;
    this.#liveAnnouncer = liveAnnouncer;
    this.#resourceSvc = resourceSvc;

    this.#id = `sky-wait-${++nextId}`;
  }

  public ngOnInit(): void {
    this.#publishAriaLabel();
    this.#publishScreenReaderCompletedText();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  #publishAriaLabel(): void {
    if (this.#customAriaLabel) {
      this.ariaLabelStream.next(this.#customAriaLabel);
      return;
    }

    /* istanbul ignore else */
    if (this.#resourceSvc) {
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
        this.#customScreenReaderCompletedText
      );
      return;
    }

    /* istanbul ignore else */
    if (this.#resourceSvc) {
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
}
