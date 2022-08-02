import { Component, ElementRef, Input, OnInit, Optional } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { BehaviorSubject } from 'rxjs';

import { SkyWaitAdapterService } from './wait-adapter.service';

let nextId = 0;

@Component({
  selector: 'sky-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.scss'],
  providers: [SkyWaitAdapterService],
})
export class SkyWaitComponent implements OnInit {
  /**
   * Specifies an ARIA label for the wait icon while an element or page loads.
   * This sets the icon's `aria-label` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * The default value varies based on whether the wait is for an element or a page
   * and whether it is a blocking wait. For example, the default for a page-blocking
   * wait is "Page loading. Please wait."
   */
  @Input()
  public ariaLabel: string;

  /**
   * When set to `true`, wait indication appears on the parent element of the `sky-wait` component.
   */
  @Input()
  public set isWaiting(value: boolean) {
    if (value && !this._isFullPage) {
      this.adapterService.setWaitBounds(this.elRef);
    } else if (!value && !this._isFullPage) {
      this.adapterService.removeWaitBounds(this.elRef);
    }

    const blockFocus = this._isFullPage || !this.isNonBlocking;
    if (blockFocus) {
      if (value) {
        // Before wait, capture the active element.
        if (
          (this.elRef.nativeElement.parentElement as HTMLElement).matches(
            ':focus-within'
          )
        ) {
          this.lastFocusElement = document.activeElement as HTMLElement;
        } else {
          this.lastFocusElement = undefined;
        }
      }
    } else {
      this.lastFocusElement = undefined;
      this.tempFocusElement = undefined;
    }

    this.adapterService.setBusyState(
      this.elRef,
      this.isFullPage,
      value,
      this.isNonBlocking,
      this.id
    );

    if (blockFocus && value && this.lastFocusElement) {
      // After applying wait, capture the active element.
      this.tempFocusElement = document.activeElement as HTMLElement;
    }

    if (blockFocus && !value && this.lastFocusElement) {
      // After removing wait, if the focus has not been moved, restore the focus.
      if (
        this.tempFocusElement &&
        this.tempFocusElement === document.activeElement
      ) {
        this.lastFocusElement.focus();
      }
      this.lastFocusElement = undefined;
      this.tempFocusElement = undefined;
    }

    this._isWaiting = value;
  }

  public get isWaiting(): boolean {
    return this._isWaiting;
  }

  /**
   * When set to `true`, wait indication appears on the page level instead of the
   * parent element level. We recommend that you use the `beginBlockingPageWait` or
   * `beginNonBlockingPageWait` functions of the `SkyWaitService` instead of setting this
   * on the component level.
   * @default false
   */
  @Input()
  public set isFullPage(value: boolean) {
    /* istanbul ignore else: untestable */
    if (value) {
      this.adapterService.removeWaitBounds(this.elRef);
    } else if (!value && this._isWaiting) {
      this.adapterService.setWaitBounds(this.elRef);
    }

    this._isFullPage = value;
  }

  public get isFullPage(): boolean {
    return this._isFullPage;
  }

  /**
   * When set to `true`, wait indication appears in the bottom left corner of the element
   * instead of hiding the entire parent element.
   * @default false
   */
  @Input()
  public isNonBlocking: boolean;

  public ariaLabelStream = new BehaviorSubject<string>('');

  private id = `sky-wait-${++nextId}`;
  private _isFullPage: boolean;
  private _isWaiting: boolean;
  private lastFocusElement: HTMLElement | undefined;
  private tempFocusElement: HTMLElement | undefined;

  constructor(
    private elRef: ElementRef,
    private adapterService: SkyWaitAdapterService,
    @Optional() private resourceService: SkyLibResourcesService
  ) {}

  public ngOnInit(): void {
    this.publishAriaLabel();
  }

  private publishAriaLabel(): void {
    if (this.ariaLabel) {
      this.ariaLabelStream.next(this.ariaLabel);
      return;
    }

    /* istanbul ignore else */
    if (this.resourceService) {
      const type = this.isFullPage ? '_page' : '';
      const blocking = this.isNonBlocking ? '' : '_blocking';
      const key = `skyux_wait${type}${blocking}_aria_alt_text`;
      this.resourceService.getString(key).subscribe((value: string) => {
        this.ariaLabelStream.next(value);
      });
    }
  }
}
