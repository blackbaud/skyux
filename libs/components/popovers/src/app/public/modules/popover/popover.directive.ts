import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';

import {
  SkyWindowRefService
} from '@skyux/core/modules/window';

import {
  SkyPopoverAlignment,
  SkyPopoverPlacement,
  SkyPopoverTrigger
} from './types';

import { SkyPopoverComponent } from './popover.component';
import { SkyPopoverMessage } from './types/popover-message';
import { SkyPopoverMessageType } from './types/popover-message-type';

@Directive({
  selector: '[skyPopover]'
})
export class SkyPopoverDirective implements OnChanges, OnDestroy {
  @Input()
  public skyPopover: SkyPopoverComponent;

  @Input()
  public skyPopoverAlignment: SkyPopoverAlignment;

  @Input()
  public skyPopoverPlacement: SkyPopoverPlacement;

  @Input()
  public skyPopoverTrigger: SkyPopoverTrigger = 'click';

  @Input()
  public skyPopoverMessageStream = new Subject<SkyPopoverMessage>();

  private idled = new Subject<boolean>();

  constructor(
    private elementRef: ElementRef,
    private windowRef: SkyWindowRefService
  ) { }

  public ngOnChanges(changes: SimpleChanges) {
    /* istanbul ignore else */
    if (changes.skyPopover) {
      this.removeEventListeners();
      if (changes.skyPopover.currentValue !== undefined) {
        this.addEventListeners();
      }
    }
  }

  public ngOnDestroy(): void {
    this.removeEventListeners();
    this.idled.complete();
  }

  public togglePopover() {
    if (this.isPopoverOpen()) {
      this.sendMessage(SkyPopoverMessageType.Close);
      return;
    }

    this.sendMessage(SkyPopoverMessageType.Open);
  }

  private positionPopover() {
    this.skyPopover.positionNextTo(
      this.elementRef,
      this.skyPopoverPlacement,
      this.skyPopoverAlignment
    );
  }

  private closePopover() {
    this.skyPopover.close();
  }

  private closePopoverOrMarkForClose() {
    if (this.skyPopover.isMouseEnter) {
      this.skyPopover.markForCloseOnMouseLeave();
    } else {
      this.sendMessage(SkyPopoverMessageType.Close);
    }
  }

  private isPopoverOpen(): boolean {
    return (this.skyPopover && this.skyPopover.isOpen);
  }

  private addEventListeners() {
    const element = this.elementRef.nativeElement;

    this.skyPopoverMessageStream
      .takeUntil(this.idled)
      .subscribe(message => {
        this.handleIncomingMessages(message);
      });

    Observable
      .fromEvent(element, 'keyup')
      .takeUntil(this.idled)
      .subscribe((event: KeyboardEvent) => {
        const key = event.key.toLowerCase();
        if (key === 'escape' && this.isPopoverOpen()) {
          event.stopPropagation();
          event.preventDefault();
          this.sendMessage(SkyPopoverMessageType.Close);
          this.elementRef.nativeElement.focus();
        }
      });

    Observable
      .fromEvent(element, 'click')
      .takeUntil(this.idled)
      .subscribe((event: any) => {
        this.togglePopover();
      });

    Observable
      .fromEvent(element, 'mouseenter')
      .takeUntil(this.idled)
      .subscribe((event: MouseEvent) => {
        this.skyPopover.isMouseEnter = true;
        if (this.skyPopoverTrigger === 'mouseenter') {
          event.preventDefault();
          this.sendMessage(SkyPopoverMessageType.Open);
        }
      });

    Observable
      .fromEvent(element, 'mouseleave')
      .takeUntil(this.idled)
      .subscribe((event: MouseEvent) => {
        this.skyPopover.isMouseEnter = false;

        if (this.skyPopoverTrigger === 'mouseenter') {
          event.preventDefault();

          if (this.isPopoverOpen()) {
            // Give the popover a chance to set its isMouseEnter flag before checking to see
            // if it should be closed.
            this.windowRef.getWindow().setTimeout(() => {
              this.closePopoverOrMarkForClose();
            });
          } else {
            // If the mouse leaves before the popover is open,
            // wait for the transition to complete before closing it.
            this.skyPopover.popoverOpened.take(1).subscribe(() => {
              this.closePopoverOrMarkForClose();
            });
          }
        }
      });
  }

  private removeEventListeners() {
    this.idled.next(true);
    this.idled.unsubscribe();
    this.idled = new Subject<boolean>();
  }

  private handleIncomingMessages(message: SkyPopoverMessage) {
    /* tslint:disable-next-line:switch-default */
    switch (message.type) {
      case SkyPopoverMessageType.Open:
        this.positionPopover();
        break;

      case SkyPopoverMessageType.Close:
        this.closePopover();
        break;

      case SkyPopoverMessageType.Reposition:
        // Only reposition the popover if it is already open.
        if (this.isPopoverOpen()) {
          this.positionPopover();
        }
        break;
    }
  }

  private sendMessage(messageType: SkyPopoverMessageType) {
    this.skyPopoverMessageStream.next({ type: messageType });
  }
}
