import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import {
  AnimationEvent,
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import {
  SkyWindowRefService
} from '@skyux/core/modules/window';

import {
  SkyPopoverAlignment,
  SkyPopoverPlacement
} from './types';

import { SkyPopoverAdapterService } from './popover-adapter.service';

@Component({
  selector: 'sky-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  providers: [SkyPopoverAdapterService],
  animations: [
    trigger('popoverState', [
      state('visible', style({ opacity: 1, visibility: 'visible' })),
      state('hidden', style({ opacity: 0 })),
      transition('hidden => visible', animate('150ms')),
      transition('visible => hidden', animate('150ms'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyPopoverComponent implements OnInit, OnDestroy {
  @Input()
  public dismissOnBlur = true;

  @Input()
  public popoverTitle: string;

  @Input()
  public set alignment(value: SkyPopoverAlignment) {
    this._alignment = value;
  }

  public get alignment(): SkyPopoverAlignment {
    return this._alignment || 'center';
  }

  @Input()
  public set placement(value: SkyPopoverPlacement) {
    this._placement = value;
  }

  public get placement(): SkyPopoverPlacement {
    return this._placement || 'above';
  }

  @Output()
  public popoverOpened = new EventEmitter<SkyPopoverComponent>();

  @Output()
  public popoverClosed = new EventEmitter<SkyPopoverComponent>();

  @ViewChild('popoverContainer')
  public popoverContainer: ElementRef;

  @ViewChild('popoverArrow')
  public popoverArrow: ElementRef;

  public isOpen = false;
  public isVisible = false;
  public isMouseEnter = false;
  public classNames: string[] = [];
  public animationState: 'hidden' | 'visible' = 'hidden';

  public popoverTop: number;
  public popoverLeft: number;
  public arrowTop: number;
  public arrowLeft: number;

  private caller: ElementRef;
  private idled = new Subject<boolean>();
  private isMarkedForCloseOnMouseLeave = false;
  private preferredPlacement: SkyPopoverPlacement;
  private scrollListeners: Function[] = [];

  private _alignment: SkyPopoverAlignment;
  private _placement: SkyPopoverPlacement;

  constructor(
    private adapterService: SkyPopoverAdapterService,
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private windowRef: SkyWindowRefService
  ) { }

  public ngOnInit() {
    this.preferredPlacement = this.placement;
    this.adapterService.hidePopover(this.popoverContainer);
  }

  public ngOnDestroy() {
    this.removeListeners();
    this.idled.complete();
  }

  public positionNextTo(
    caller: ElementRef,
    placement?: SkyPopoverPlacement,
    alignment?: SkyPopoverAlignment
  ) {
    if (!caller) {
      return;
    }

    this.close();

    this.caller = caller;
    this.placement = placement;
    this.alignment = alignment;
    this.preferredPlacement = this.placement;
    this.changeDetector.markForCheck();

    // Let the styles render before gauging the dimensions.
    this.windowRef.getWindow().setTimeout(() => {
      if (this.adapterService.isPopoverLargerThanParent(this.popoverContainer)) {
        this.placement = 'fullscreen';
      }

      this.isVisible = true;
      this.positionPopover();
      this.addListeners();
      this.animationState = 'visible';
      this.changeDetector.markForCheck();
    });
  }

  public reposition() {
    this.placement = this.preferredPlacement;
    this.changeDetector.markForCheck();

    if (this.adapterService.isPopoverLargerThanParent(this.popoverContainer)) {
      this.placement = 'fullscreen';
    }

    this.positionPopover();
  }

  public close() {
    this.animationState = 'hidden';
    this.removeListeners();
    this.changeDetector.markForCheck();
  }

  public onAnimationStart(event: AnimationEvent) {
    if (event.fromState === 'void') {
      return;
    }

    if (event.toState === 'visible') {
      this.adapterService.showPopover(this.popoverContainer);
    }
  }

  public onAnimationDone(event: AnimationEvent) {
    if (event.fromState === 'void') {
      return;
    }

    if (event.toState === 'hidden') {
      this.isOpen = false;
      this.adapterService.hidePopover(this.popoverContainer);
      this.popoverClosed.emit(this);
    } else {
      this.isOpen = true;
      this.popoverOpened.emit(this);
    }
  }

  // TODO: This method is no longer used. Remove it when we decide to make breaking changes.
  public markForCloseOnMouseLeave() {
    this.isMarkedForCloseOnMouseLeave = true;
  }

  private positionPopover() {
    if (this.placement !== 'fullscreen') {
      const elements = {
        popover: this.popoverContainer,
        popoverArrow: this.popoverArrow,
        caller: this.caller
      };

      const position = this.adapterService.getPopoverPosition(
        elements,
        this.preferredPlacement,
        this.alignment
      );

      this.placement = position.placement;
      this.alignment = position.alignment;
      this.popoverTop = position.top;
      this.popoverLeft = position.left;
      this.arrowTop = position.arrowTop;
      this.arrowLeft = position.arrowLeft;
    }

    this.changeDetector.markForCheck();
  }

  private addListeners(): void {
    const windowObj = this.windowRef.getWindow();
    const hostElement = this.elementRef.nativeElement;

    Observable
      .fromEvent(windowObj, 'resize')
      .takeUntil(this.idled)
      .subscribe(() => {
        this.reposition();
      });

    Observable
      .fromEvent(windowObj.document, 'focusin')
      .takeUntil(this.idled)
      .subscribe((event: KeyboardEvent) => {
        const targetIsChild = (hostElement.contains(event.target));
        const targetIsCaller = (this.caller && this.caller.nativeElement === event.target);

        /* istanbul ignore else */
        if (!targetIsChild && !targetIsCaller && this.dismissOnBlur) {
          // The popover is currently being operated by the user, and
          // has just lost keyboard focus. We should close it.
          this.close();
        }
      });

    Observable
      .fromEvent(windowObj.document, 'click')
      .takeUntil(this.idled)
      .subscribe((event: MouseEvent) => {
        if (!this.isMouseEnter && this.dismissOnBlur) {
          this.close();
        }
      });

    Observable
      .fromEvent(hostElement, 'mouseenter')
      .takeUntil(this.idled)
      .subscribe(() => {
        this.isMouseEnter = true;
      });

    Observable
      .fromEvent(hostElement, 'mouseleave')
      .takeUntil(this.idled)
      .subscribe(() => {
        this.isMouseEnter = false;
        if (this.isMarkedForCloseOnMouseLeave) {
          this.close();
          this.isMarkedForCloseOnMouseLeave = false;
        }
      });

    Observable
      .fromEvent(hostElement, 'keyup')
      .takeUntil(this.idled)
      .subscribe((event: KeyboardEvent) => {
        const key = event.key.toLowerCase();

        if (key === 'escape') {
          event.stopPropagation();
          event.preventDefault();
          this.close();

          /* istanbul ignore else */
          if (this.caller) {
            this.caller.nativeElement.focus();
          }
        }
      });

    this.scrollListeners = this.adapterService
      .getParentScrollListeners(this.popoverContainer, (isElementVisibleWithinScrollable: boolean) => {
        this.reposition();
        this.isVisible = isElementVisibleWithinScrollable;
        this.changeDetector.markForCheck();
      });
  }

  private removeListeners(): void {
    this.idled.next(true);

    if (this.scrollListeners) {
      this.scrollListeners.forEach((listener: any) => {
        // Remove renderer-generated listeners by calling the listener itself.
        // https://github.com/angular/angular/issues/9368#issuecomment-227199778
        listener();
      });

      this.scrollListeners = [];
    }
  }
}
