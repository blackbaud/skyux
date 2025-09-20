import {
  Component,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import {
  SKY_STACKING_CONTEXT,
  SkyAppWindowRef,
  SkyIdService,
  SkyOverlayInstance,
  SkyOverlayService,
  SkyStackingContext,
} from '@skyux/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyPopoverContentComponent } from './popover-content.component';
import { SkyPopoverContext } from './popover-context';
import { SkyPopoverAlignment } from './types/popover-alignment';
import { SkyPopoverPlacement } from './types/popover-placement';
import { SkyPopoverType } from './types/popover-type';

@Component({
  selector: 'sky-popover',
  templateUrl: './popover.component.html',
  standalone: false,
})
export class SkyPopoverComponent implements OnDestroy {
  readonly #windowRef = inject(SkyAppWindowRef);

  /**
   * The horizontal alignment of the popover in relation to the trigger element.
   * The `skyPopoverAlignment` property on the popover directive takes precedence over this property when specified.
   * @default "center"
   */
  @Input()
  public set alignment(value: SkyPopoverAlignment | undefined) {
    this.#_alignment = value ?? 'center';
  }

  public get alignment(): SkyPopoverAlignment {
    return this.#_alignment;
  }

  /**
   * The placement of the popover in relation to the trigger element.
   * The `skyPopoverPlacement` property on the popover directive takes precedence over this property when specified.
   * @default "above"
   */
  @Input()
  public set placement(value: SkyPopoverPlacement | undefined) {
    this.#_placement = value ?? 'above';
  }

  public get placement(): SkyPopoverPlacement {
    return this.#_placement;
  }

  /**
   * The title for the popover.
   */
  @Input()
  public popoverTitle: string | undefined;

  /**
   * The type of popover.
   * @default "info"
   */
  @Input()
  public set popoverType(value: SkyPopoverType | undefined) {
    this.#_popoverType = value ?? 'info';
  }

  public get popoverType(): SkyPopoverType {
    return this.#_popoverType;
  }

  /**
   * Fires when users close the popover.
   */
  @Output()
  public popoverClosed = new EventEmitter<SkyPopoverComponent>();

  /**
   * Fires when users open the popover.
   */
  @Output()
  public popoverOpened = new EventEmitter<SkyPopoverComponent>();

  /**
   * Whether the popover is in the process of being opened or closed.
   * @internal
   */
  public isActive = false;

  /**
   * Used by unit tests to disable animations since the component is injected at the bottom of the
   * document body.
   * @internal
   */
  public enableAnimations = true;

  public isMouseEnter = false;

  public popoverId: string;

  @ViewChild('templateRef', {
    read: TemplateRef,
    static: true,
  })
  public templateRef: TemplateRef<unknown> | undefined;

  #contentRef!: SkyPopoverContentComponent;

  #isMarkedForCloseOnMouseLeave = false;

  #ngUnsubscribe = new Subject<void>();

  #overlay: SkyOverlayInstance | undefined;

  #_alignment: SkyPopoverAlignment = 'center';

  #_placement: SkyPopoverPlacement = 'above';

  #_popoverType: SkyPopoverType = 'info';

  readonly #environmentInjector = inject(EnvironmentInjector);

  #overlayService: SkyOverlayService;

  #zIndex: Observable<number> | undefined;

  constructor(
    overlayService: SkyOverlayService,
    @Optional()
    @Inject(SKY_STACKING_CONTEXT)
    stackingContext?: SkyStackingContext,
  ) {
    this.#overlayService = overlayService;
    this.#zIndex = stackingContext?.zIndex;

    this.popoverId = inject(SkyIdService).generateId();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    if (this.#overlay) {
      this.#overlayService.close(this.#overlay);
      this.#overlay = undefined;
    }
  }

  /**
   * Positions the popover next to a given caller element.
   * @param caller The element that opened the popover.
   * @param placement The placement of the popover.
   * @param alignment The horizontal alignment of the popover.
   * @internal
   */
  public positionNextTo(
    caller: ElementRef,
    placement?: SkyPopoverPlacement,
    alignment?: SkyPopoverAlignment,
  ): void {
    this.placement = placement ?? this.placement;
    this.alignment = alignment ?? this.alignment;
    this.isActive = true;

    if (!this.#overlay) {
      this.#setupOverlay();

      // Wait for the overlay component to be fully initialized before opening.
      // Create a microtask to prioritize opening the popover immediately after
      // setting up its overlay.
      this.#windowRef.nativeWindow.queueMicrotask(() => {
        this.#openPopover(caller);
      });
    } else {
      this.#openPopover(caller);
    }
  }

  #openPopover(caller: ElementRef): void {
    this.#contentRef.open(caller, {
      enableAnimations: this.enableAnimations,
      horizontalAlignment: this.alignment,
      id: this.popoverId,
      isStatic: false,
      placement: this.placement,
      popoverTitle: this.popoverTitle,
      popoverType: this.popoverType,
    });
  }

  /**
   * Closes the popover.
   * @internal
   */
  public close(): void {
    /*istanbul ignore next*/
    this.#contentRef?.close();
  }

  /**
   * Brings focus to the popover element if its open.
   * @internal
   */
  public applyFocus(): void {
    /*istanbul ignore next*/
    this.#contentRef?.applyFocus();
  }

  /**
   * Adds a flag to the popover to close when the mouse leaves the popover's bounds.
   * @internal
   */
  public markForCloseOnMouseLeave(): void {
    this.#isMarkedForCloseOnMouseLeave = true;
  }

  public hasFocusableContent(): boolean {
    return this.#contentRef.hasFocusableContent();
  }

  #setupOverlay(): void {
    if (this.templateRef) {
      const overlay = this.#overlayService.create({
        enableScroll: true,
        enablePointerEvents: true,
        environmentInjector: this.#environmentInjector,
      });

      if (this.#zIndex) {
        this.#zIndex
          .pipe(takeUntil(this.#ngUnsubscribe))
          .subscribe((zIndex) => {
            overlay.componentRef.instance.zIndex = zIndex.toString(10);
          });
      }

      overlay.backdropClick
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.close();
        });

      const contentRef = overlay.attachComponent(SkyPopoverContentComponent, [
        {
          provide: SkyPopoverContext,
          useValue: new SkyPopoverContext({
            contentTemplateRef: this.templateRef,
          }),
        },
      ]);

      contentRef.opened.pipe(takeUntil(this.#ngUnsubscribe)).subscribe(() => {
        this.popoverOpened.emit(this);
      });

      contentRef.closed.pipe(takeUntil(this.#ngUnsubscribe)).subscribe(() => {
        /*istanbul ignore else*/
        if (this.isActive && this.#overlay) {
          this.#overlayService.close(this.#overlay);
          this.#overlay = undefined;
          this.isActive = false;
          this.popoverClosed.emit(this);
        }
      });

      contentRef.isMouseEnter
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((isMouseEnter) => {
          this.isMouseEnter = isMouseEnter;
          if (this.#isMarkedForCloseOnMouseLeave) {
            this.#isMarkedForCloseOnMouseLeave = false;
            this.close();
          }
        });

      this.#overlay = overlay;
      this.#contentRef = contentRef;
    }
  }
}
