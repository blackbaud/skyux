import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';

import { Subject, Subscription, fromEvent as observableFromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyPopoverComponent } from './popover.component';
import { SkyPopoverAlignment } from './types/popover-alignment';
import { SkyPopoverMessage } from './types/popover-message';
import { SkyPopoverMessageType } from './types/popover-message-type';
import { SkyPopoverPlacement } from './types/popover-placement';
import { SkyPopoverTrigger } from './types/popover-trigger';

@Directive({
  selector: '[skyPopover]',
})
export class SkyPopoverDirective implements OnInit, OnDestroy {
  /**
   * Appends the `sky-popover-trigger` class to the trigger element.
   * @internal
   */
  @HostBinding('class')
  protected directiveClass = 'sky-popover-trigger';

  /**
   * The ID of the opened popover element.
   * @internal
   */
  protected popoverId: string | undefined;

  /**
   * The popover component to display. Add this directive to the trigger element that opens the popover.
   * @required
   */
  @Input()
  public set skyPopover(value: SkyPopoverComponent | undefined) {
    this.popoverId = value?.popoverId;
    this.#_popover = value;

    if (value) {
      value.popoverClosed.subscribe(() => {
        this.#updateAriaAttributes({ isExpanded: false });
      });
    }
  }

  public get skyPopover(): SkyPopoverComponent | undefined {
    return this.#_popover;
  }

  /**
   * The horizontal alignment of the popover in relation to the trigger element.
   */
  @Input()
  public skyPopoverAlignment: SkyPopoverAlignment | undefined;

  /**
   * The RxJS `Subject` to send commands to the popover that respect the `SkyPopoverMessage` type.
   */
  @Input()
  public set skyPopoverMessageStream(
    value: Subject<SkyPopoverMessage> | undefined,
  ) {
    this.#_skyPopoverMessageStream = value ?? new Subject<SkyPopoverMessage>();
    this.#subscribeMessageStream();
  }

  public get skyPopoverMessageStream(): Subject<SkyPopoverMessage> {
    return this.#_skyPopoverMessageStream;
  }

  #_skyPopoverMessageStream = new Subject<SkyPopoverMessage>();

  #messageStreamSub: Subscription | undefined;

  /**
   * The placement of the popover in relation to the trigger element.
   */
  @Input()
  public skyPopoverPlacement: SkyPopoverPlacement | undefined;

  /**
   * The user action that displays the popover.
   * @deprecated Due to accessibility concerns, popovers should always be opened
   * when the user clicks the trigger element. Do not set this attribute so that
   * the default behavior of "click" is used.
   */
  @Input()
  public set skyPopoverTrigger(value: SkyPopoverTrigger | undefined) {
    this.#_trigger = value ?? 'click';
  }

  public get skyPopoverTrigger(): SkyPopoverTrigger {
    return this.#_trigger;
  }

  #ngUnsubscribe = new Subject<void>();

  #_popover: SkyPopoverComponent | undefined;

  #_trigger: SkyPopoverTrigger = 'click';

  #elementRef: ElementRef;
  #srPointerEl: HTMLSpanElement | undefined;

  readonly #renderer = inject(Renderer2);

  constructor(elementRef: ElementRef) {
    this.#elementRef = elementRef;
    this.#subscribeMessageStream();
  }

  public ngOnInit(): void {
    this.#addEventListeners();
    this.#createSRPointerEl();
  }

  public ngOnDestroy(): void {
    this.#removeEventListeners();
    this.#unsubscribeMessageStream();
    this.#srPointerEl?.remove();
  }

  public togglePopover(): void {
    if (this.skyPopover?.isActive) {
      this.#sendMessage(SkyPopoverMessageType.Close);
      return;
    }

    this.#sendMessage(SkyPopoverMessageType.Open);
  }

  #positionPopover(): void {
    this.skyPopover?.positionNextTo(
      this.#elementRef,
      this.skyPopoverPlacement,
      this.skyPopoverAlignment,
    );
  }

  #closePopover(): void {
    this.skyPopover?.close();
    this.#updateAriaAttributes({ isExpanded: false });
  }

  #closePopoverOrMarkForClose(): void {
    if (this.skyPopover?.isMouseEnter) {
      this.skyPopover.markForCloseOnMouseLeave();
    } else {
      this.#sendMessage(SkyPopoverMessageType.Close);
    }
  }

  #addEventListeners(): void {
    const element = this.#elementRef.nativeElement;

    observableFromEvent<KeyboardEvent>(element, 'keydown')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((event) => {
        if (!this.skyPopover?.isActive) {
          return;
        }

        const key = event.key.toLowerCase();

        switch (key) {
          case 'escape':
            this.#sendMessage(SkyPopoverMessageType.Close);
            event.preventDefault();
            event.stopPropagation();
            break;

          case 'tab':
            if (this.skyPopover.hasFocusableContent()) {
              this.#sendMessage(SkyPopoverMessageType.Focus);
              event.stopPropagation();
              event.preventDefault();
            } else if (this.skyPopover.dismissOnBlur) {
              this.#sendMessage(SkyPopoverMessageType.Close);
            }
            break;
        }
      });

    observableFromEvent(element, 'click')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        if (this.skyPopover) {
          this.togglePopover();
        }
      });

    observableFromEvent(element, 'mouseenter')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        if (this.skyPopover) {
          this.skyPopover.isMouseEnter = true;
          if (
            !this.skyPopover.isActive &&
            this.skyPopoverTrigger === 'mouseenter'
          ) {
            this.#sendMessage(SkyPopoverMessageType.Open);
          }
        }
      });

    observableFromEvent(element, 'mouseleave')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        if (this.skyPopover) {
          this.skyPopover.isMouseEnter = false;
          if (
            this.skyPopover.isActive &&
            this.skyPopoverTrigger === 'mouseenter'
          ) {
            if (document.activeElement !== element) {
              // Give the popover a chance to set its isMouseEnter flag before checking to see
              // if it should be closed.
              setTimeout(() => {
                this.#closePopoverOrMarkForClose();
              });
            }
          }
        }
      });

    observableFromEvent(element, 'focusin')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        if (this.skyPopover) {
          if (
            !this.skyPopover.isActive &&
            this.skyPopoverTrigger === 'mouseenter'
          ) {
            this.#sendMessage(SkyPopoverMessageType.Open);
          }
        }
      });

    observableFromEvent(element, 'focusout')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        if (this.skyPopover) {
          if (
            this.skyPopover.isActive &&
            this.skyPopoverTrigger === 'mouseenter'
          ) {
            this.#sendMessage(SkyPopoverMessageType.Close);
          }
        }
      });
  }

  #removeEventListeners(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  #handleIncomingMessages(message: SkyPopoverMessage): void {
    switch (message.type) {
      case SkyPopoverMessageType.Open:
        this.#positionPopover();
        this.#updateAriaAttributes({ isExpanded: true });
        break;

      case SkyPopoverMessageType.Close:
        /*istanbul ignore else*/
        if (this.skyPopover?.isActive) {
          this.#closePopover();
        }
        break;

      case SkyPopoverMessageType.Reposition:
        // Only reposition the popover if it is already open.
        if (this.skyPopover?.isActive) {
          this.#positionPopover();
        }
        break;

      case SkyPopoverMessageType.Focus:
        this.skyPopover?.applyFocus();
        break;
    }
  }

  #sendMessage(messageType: SkyPopoverMessageType): void {
    this.skyPopoverMessageStream.next({ type: messageType });
  }

  #subscribeMessageStream(): void {
    this.#unsubscribeMessageStream();

    this.#messageStreamSub = this.skyPopoverMessageStream.subscribe(
      (message) => {
        this.#handleIncomingMessages(message);
      },
    );
  }

  #unsubscribeMessageStream(): void {
    if (this.#messageStreamSub) {
      this.#messageStreamSub.unsubscribe();
      this.#messageStreamSub = undefined;
    }
  }

  /**
   * Inserts an element after the host element that points to the contents of the popover using `aria-owns`. This pointer element is added directly after the trigger element to direct screen readers to the popover contents after navigating (using "quick nav", etc.) away from the button.
   */
  #createSRPointerEl(): void {
    const span = this.#renderer.createElement('span');
    this.#renderer.setAttribute(span, 'class', 'sky-screen-reader-only');
    this.#srPointerEl = span;

    this.#elementRef.nativeElement.parentNode.insertBefore(
      this.#srPointerEl,
      this.#elementRef.nativeElement.nextSibling,
    );
  }

  #updateAriaAttributes(options: {
    /**
     * Whether the popover button should be marked as "expanded".
     */
    isExpanded: boolean;
  }): void {
    const hostEl = this.#elementRef.nativeElement;
    const pointerEl = this.#srPointerEl;

    if (options.isExpanded === true) {
      this.#renderer.setAttribute(hostEl, 'aria-expanded', 'true');

      if (this.popoverId) {
        this.#renderer.setAttribute(pointerEl, 'aria-owns', this.popoverId);
        this.#renderer.setAttribute(hostEl, 'aria-controls', this.popoverId);
      }
    } else {
      this.#renderer.setAttribute(hostEl, 'aria-expanded', 'false');
      this.#renderer.removeAttribute(pointerEl, 'aria-owns');
      this.#renderer.removeAttribute(hostEl, 'aria-controls');
    }
  }
}
