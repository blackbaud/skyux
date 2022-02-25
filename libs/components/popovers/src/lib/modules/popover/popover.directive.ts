import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

import { fromEvent as observableFromEvent, Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import { SkyPopoverAlignment } from './types/popover-alignment';

import { SkyPopoverPlacement } from './types/popover-placement';

import { SkyPopoverTrigger } from './types/popover-trigger';

import { SkyPopoverComponent } from './popover.component';

import { SkyPopoverMessage } from './types/popover-message';

import { SkyPopoverMessageType } from './types/popover-message-type';

@Directive({
  selector: '[skyPopover]',
})
export class SkyPopoverDirective implements OnInit, OnDestroy {
  /**
   * References the popover component to display. Add this directive to the trigger element that opens the popover.
   * @required
   */
  @Input()
  public skyPopover: SkyPopoverComponent;

  /**
   * Specifies the horizontal alignment of the popover in relation to the trigger element.
   * Options include:`"center"`, `"right"`, and `"left"`.
   * @default "center"
   */
  @Input()
  public skyPopoverAlignment: SkyPopoverAlignment;

  /**
   * Provides an observable to send commands to the popover that respect the `SkyPopoverMessage` type.
   */
  @Input()
  public skyPopoverMessageStream = new Subject<SkyPopoverMessage>();

  /**
   * Specifies the placement of the popover in relation to the trigger element.
   * Options include:`"above"`, `"below"`, `"right"`, and `"left"`.
   * @default "above"
   */
  @Input()
  public skyPopoverPlacement: SkyPopoverPlacement;

  /**
   * Specifies the user action that displays the popover.
   */
  @Input()
  public set skyPopoverTrigger(value: SkyPopoverTrigger) {
    this._trigger = value;
  }

  public get skyPopoverTrigger(): SkyPopoverTrigger {
    return this._trigger || 'click';
  }

  private ngUnsubscribe = new Subject<void>();

  private _trigger: SkyPopoverTrigger;

  constructor(private elementRef: ElementRef) {}

  public ngOnInit(): void {
    this.addEventListeners();
  }

  public ngOnDestroy(): void {
    this.removeEventListeners();
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

    this.skyPopoverMessageStream
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message) => {
        this.handleIncomingMessages(message);
      });

    observableFromEvent(element, 'keydown')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event: KeyboardEvent) => {
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
    this.ngUnsubscribe = undefined;
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
}
