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
   * wait is "Page loading. Please wait."
   * For more information about the `aria-label` attribute, see the [WAI-ARIA Definitions of States and Properties](https://www.w3.org/TR/wai-aria/#aria-label).
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

  public ariaLabelStream = new BehaviorSubject<string>('');

  #elRef: ElementRef;
  #adapterService: SkyWaitAdapterService;
  #resourceSvc: SkyLibResourcesService;
  #ngUnsubscribe = new Subject<void>();

  #id: string;
  #customAriaLabel: string | undefined;

  #_isFullPage: boolean | undefined;
  #_isNonBlocking: boolean | undefined;
  #_isWaiting: boolean | undefined;

  constructor(
    elRef: ElementRef,
    adapterService: SkyWaitAdapterService,
    @Optional() resourceSvc: SkyLibResourcesService
  ) {
    this.#elRef = elRef;
    this.#adapterService = adapterService;
    this.#resourceSvc = resourceSvc;

    this.#id = `sky-wait-${++nextId}`;
  }

  public ngOnInit(): void {
    this.#publishAriaLabel();
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
}
