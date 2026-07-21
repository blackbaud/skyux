import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';

import { Subject, Subscription, fromEvent as observableFromEvent } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkyPopoverKeyboardShortcutService } from './popover-keyboard-shortcut.service';
import { SkyPopoverSRPointerService } from './popover-sr-pointer.service';
import { SkyPopoverComponent } from './popover.component';
import { SkyPopoverAlignment } from './types/popover-alignment';
import { SkyPopoverMessage } from './types/popover-message';
import { SkyPopoverMessageType } from './types/popover-message-type';
import { SkyPopoverPlacement } from './types/popover-placement';
import { SkyPopoverTrigger } from './types/popover-trigger';

@Directive({
  providers: [SkyPopoverSRPointerService],
  selector: '[skyPopover]',
  standalone: false,
})
export class SkyPopoverDirective implements OnInit, OnDestroy {
  /**
   * Appends the `sky-popover-trigger` class to the trigger element.
   * @internal
   */
  @HostBinding('class')
  protected directiveClass = 'sky-popover-trigger';

  protected popoverId: string | undefined;

  /**
   * The popover component to display. Add this directive to the trigger element that opens the popover.
   * @required
   */
  @Input()
  public set skyPopover(value: SkyPopoverComponent | undefined) {
    this.popoverId = value?.popoverId;
    this.#_popover = value;
    this.#updateSRPointer(value);
    this.#updateKeyboardShortcut(value);
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
   * @deprecated To ensure usability on touch devices, trigger user-invoked
   * popovers on `click` actions rather than `mouseenter` actions.
   */
  @Input()
  public set skyPopoverTrigger(value: SkyPopoverTrigger | undefined) {
    this.#_trigger = value ?? 'click';
    this.#updateAriaAttributes();
  }

  public get skyPopoverTrigger(): SkyPopoverTrigger {
    return this.#_trigger;
  }

  #ngUnsubscribe = new Subject<void>();

  #_popover: SkyPopoverComponent | undefined;

  #_trigger: SkyPopoverTrigger = 'click';

  readonly #document = inject(DOCUMENT);
  readonly #elementRef = inject(ElementRef);
  #expanded = false;
  #popoverClosedSubscription: Subscription | undefined;
  #shortcutFocusOutSubscription: Subscription | undefined;
  #shortcutFocusSubscription: Subscription | undefined;
  #unregisterKeyboardShortcut: (() => void) | undefined;

  readonly #keyboardShortcutSvc = inject(SkyPopoverKeyboardShortcutService);
  readonly #srPointerSvc = inject(SkyPopoverSRPointerService);

  constructor() {
    this.#subscribeMessageStream();
  }

  public ngOnInit(): void {
    this.#addEventListeners();
  }

  public ngOnDestroy(): void {
    this.#removeEventListeners();
    this.#unsubscribeMessageStream();
    this.#popoverClosedSubscription?.unsubscribe();
    this.#unregisterKeyboardShortcut?.();
    this.#unsubscribeKeyboardShortcutSession();
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
            } else {
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
        this.#expanded = true;
        this.#updateAriaAttributes();
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

  #updateAriaAttributes(): void {
    this.#srPointerSvc.updateAriaAttributes({
      ariaExpanded: this.#expanded,
      ariaOwns: this.popoverId,
    });
  }

  #openViaKeyboardShortcut(): void {
    this.#focusPopoverWhenReady();

    if (this.skyPopover?.isActive) {
      return;
    }

    this.#sendMessage(SkyPopoverMessageType.Open);
  }

  #focusPopoverWhenReady(): void {
    this.#shortcutFocusSubscription?.unsubscribe();

    if (this.skyPopover?.isActive) {
      return;
    }

    this.#shortcutFocusSubscription = this.skyPopover?.popoverOpened
      .pipe(take(1))
      .subscribe(() => {
        if (this.skyPopover?.hasFocusableContent()) {
          this.#sendMessage(SkyPopoverMessageType.Focus);
        }
        this.#watchKeyboardShortcutSession();
      });
  }

  #watchKeyboardShortcutSession(): void {
    this.#shortcutFocusOutSubscription?.unsubscribe();

    const popover = this.skyPopover;

    /*istanbul ignore next*/
    if (!popover) {
      return;
    }

    const stopWatching = new Subject<void>();

    const focusOutSubscription = new Subscription();

    focusOutSubscription.add(
      popover.popoverClosed.pipe(take(1)).subscribe(() => stopWatching.next()),
    );

    focusOutSubscription.add(
      observableFromEvent(this.#document, 'focusin')
        .pipe(takeUntil(stopWatching))
        .subscribe(() => {
          const activeElement = this.#document.activeElement;
          const popoverEl = popover.popoverId
            ? this.#document.getElementById(popover.popoverId)
            : null;

          const isWithin = (el: Element | null): boolean =>
            !!activeElement && !!el && el.contains(activeElement);

          if (
            !isWithin(this.#elementRef.nativeElement) &&
            !isWithin(popoverEl)
          ) {
            this.#sendMessage(SkyPopoverMessageType.Close);
          }
        }),
    );

    focusOutSubscription.add(
      observableFromEvent<KeyboardEvent>(this.#document, 'keydown')
        .pipe(takeUntil(stopWatching))
        .subscribe((event) => {
          if (event.altKey && event.key === 'ArrowDown') {
            event.preventDefault();
            this.#sendMessage(SkyPopoverMessageType.Close);
            this.#elementRef.nativeElement.focus();
          }
        }),
    );

    this.#shortcutFocusOutSubscription = focusOutSubscription;
  }

  #updateKeyboardShortcut(popover: SkyPopoverComponent | undefined): void {
    this.#unsubscribeKeyboardShortcutSession();
    this.#unregisterKeyboardShortcut?.();
    this.#unregisterKeyboardShortcut = popover
      ? this.#keyboardShortcutSvc.register(this.#elementRef, () =>
          this.#openViaKeyboardShortcut(),
        )
      : undefined;
  }

  #unsubscribeKeyboardShortcutSession(): void {
    this.#shortcutFocusSubscription?.unsubscribe();
    this.#shortcutFocusOutSubscription?.unsubscribe();
  }

  #updateSRPointer(popover: SkyPopoverComponent | undefined): void {
    this.#popoverClosedSubscription?.unsubscribe();
    this.#popoverClosedSubscription = popover
      ? popover.popoverClosed.subscribe(() => {
          this.#expanded = false;
          this.#updateAriaAttributes();
        })
      : undefined;

    if (popover) {
      if (this.skyPopoverTrigger === 'click') {
        this.#srPointerSvc.createSRPointerEl();
      }
    } else {
      this.#srPointerSvc.destroySRPointerEl();
    }

    this.#updateAriaAttributes();
  }
}
