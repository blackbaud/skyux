import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

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
   * References the popover component to display. Add this directive to the trigger element that opens the popover.
   * @required
   */
  @Input()
  public skyPopover!: SkyPopoverComponent;

  /**
   * Specifies the horizontal alignment of the popover in relation to the trigger element.
   */
  @Input()
  public skyPopoverAlignment: SkyPopoverAlignment | undefined;

  /**
   * Provides an RxJS `Subject` to send commands to the popover that respect the `SkyPopoverMessage` type.
   */
  @Input()
  public set skyPopoverMessageStream(
    value: Subject<SkyPopoverMessage> | undefined
  ) {
    this._skyPopoverMessageStream = value ?? new Subject<SkyPopoverMessage>();
    this.subscribeMessageStream();
  }

  public get skyPopoverMessageStream(): Subject<SkyPopoverMessage> {
    return this._skyPopoverMessageStream;
  }

  private _skyPopoverMessageStream = new Subject<SkyPopoverMessage>();

  #messageStreamSub: Subscription | undefined;

  /**
   * Specifies the placement of the popover in relation to the trigger element.
   */
  @Input()
  public skyPopoverPlacement: SkyPopoverPlacement | undefined;

  /**
   * Specifies the user action that displays the popover.
   */
  @Input()
  public set skyPopoverTrigger(value: SkyPopoverTrigger | undefined) {
    this._trigger = value;
  }

  public get skyPopoverTrigger(): SkyPopoverTrigger {
    return this._trigger || 'click';
  }

  private ngUnsubscribe = new Subject<void>();

  private _trigger: SkyPopoverTrigger | undefined;

  constructor(private elementRef: ElementRef) {
    this.subscribeMessageStream();
  }

  public ngOnInit(): void {
    this.addEventListeners();
  }

  public ngOnDestroy(): void {
    this.removeEventListeners();
    this.unsubscribeMessageStream();
  }

  public togglePopover(): void {
    if (this.skyPopover.isActive) {
      this.sendMessage(SkyPopoverMessageType.Close);
      return;
    }

    this.sendMessage(SkyPopoverMessageType.Open);
  }

  private positionPopover(): void {
    this.skyPopover.positionNextTo(
      this.elementRef,
      this.skyPopoverPlacement,
      this.skyPopoverAlignment
    );
  }

  private closePopover(): void {
    this.skyPopover.close();
  }

  private closePopoverOrMarkForClose(): void {
    if (this.skyPopover.isMouseEnter) {
      this.skyPopover.markForCloseOnMouseLeave();
    } else {
      this.sendMessage(SkyPopoverMessageType.Close);
    }
  }

  private addEventListeners(): void {
    const element = this.elementRef.nativeElement;

    observableFromEvent<KeyboardEvent>(element, 'keydown')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event) => {
        if (!this.skyPopover.isActive) {
          return;
        }

        const key = event.key.toLowerCase();

        /* tslint:disable-next-line:switch-default */
        switch (key) {
          case 'escape':
            this.sendMessage(SkyPopoverMessageType.Close);
            event.preventDefault();
            event.stopPropagation();
            break;

          case 'tab':
            if (this.skyPopover.dismissOnBlur) {
              this.sendMessage(SkyPopoverMessageType.Close);
            }
            break;

          case 'arrowdown':
          case 'arrowleft':
          case 'arrowright':
          case 'arrowup':
          case 'down':
          case 'left':
          case 'right':
          case 'up':
            this.sendMessage(SkyPopoverMessageType.Focus);
            event.stopPropagation();
            event.preventDefault();
            break;
        }
      });

    observableFromEvent(element, 'click')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (this.skyPopover) {
          this.togglePopover();
        }
      });

    observableFromEvent(element, 'mouseenter')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (this.skyPopover) {
          this.skyPopover.isMouseEnter = true;
          if (
            !this.skyPopover.isActive &&
            this.skyPopoverTrigger === 'mouseenter'
          ) {
            this.sendMessage(SkyPopoverMessageType.Open);
          }
        }
      });

    observableFromEvent(element, 'mouseleave')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (this.skyPopover) {
          this.skyPopover.isMouseEnter = false;
          if (
            this.skyPopover.isActive &&
            this.skyPopoverTrigger === 'mouseenter'
          ) {
            // Give the popover a chance to set its isMouseEnter flag before checking to see
            // if it should be closed.
            setTimeout(() => {
              this.closePopoverOrMarkForClose();
            });
          }
        }
      });
  }

  private removeEventListeners(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private handleIncomingMessages(message: SkyPopoverMessage): void {
    /* tslint:disable-next-line:switch-default */
    switch (message.type) {
      case SkyPopoverMessageType.Open:
        this.positionPopover();
        break;

      case SkyPopoverMessageType.Close:
        /*istanbul ignore else*/
        if (this.skyPopover.isActive) {
          this.closePopover();
        }
        break;

      case SkyPopoverMessageType.Reposition:
        // Only reposition the popover if it is already open.
        if (this.skyPopover.isActive) {
          this.positionPopover();
        }
        break;

      case SkyPopoverMessageType.Focus:
        this.skyPopover.applyFocus();
        break;
    }
  }

  private sendMessage(messageType: SkyPopoverMessageType): void {
    this.skyPopoverMessageStream.next({ type: messageType });
  }

  private subscribeMessageStream(): void {
    this.unsubscribeMessageStream();

    this.#messageStreamSub = this.skyPopoverMessageStream.subscribe(
      (message) => {
        this.handleIncomingMessages(message);
      }
    );
  }

  private unsubscribeMessageStream(): void {
    if (this.#messageStreamSub) {
      this.#messageStreamSub.unsubscribe();
      this.#messageStreamSub = undefined;
    }
  }
}
