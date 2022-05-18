import { AnimationEvent } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  SkyAffixAutoFitContext,
  SkyAffixConfig,
  SkyAffixService,
  SkyAffixer,
  SkyCoreAdapterService,
} from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';

import { Observable, Subject, fromEvent as observableFromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyPopoverAdapterService } from './popover-adapter.service';
import { skyPopoverAnimation } from './popover-animation';
import { SkyPopoverAnimationState } from './popover-animation-state';
import { SkyPopoverContext } from './popover-context';
import {
  parseAffixHorizontalAlignment,
  parseAffixPlacement,
} from './popover-extensions';
import { SkyPopoverAlignment } from './types/popover-alignment';
import { SkyPopoverPlacement } from './types/popover-placement';
import { SkyPopoverType } from './types/popover-type';

/**
 * @internal
 */
@Component({
  selector: 'sky-popover-content',
  templateUrl: './popover-content.component.html',
  styleUrls: ['./popover-content.component.scss'],
  animations: [skyPopoverAnimation],
  providers: [SkyPopoverAdapterService],
})
export class SkyPopoverContentComponent implements OnInit, OnDestroy {
  public get animationState(): SkyPopoverAnimationState {
    return this.isOpen ? 'open' : 'closed';
  }

  public get closed(): Observable<void> {
    return this._closed.asObservable();
  }

  public get opened(): Observable<void> {
    return this._opened.asObservable();
  }

  public get isMouseEnter(): Observable<boolean> {
    return this._isMouseEnter.asObservable();
  }

  public affixer: SkyAffixer | undefined;

  public arrowLeft: number | undefined;

  public arrowTop: number | undefined;

  public dismissOnBlur = true;

  public enableAnimations = true;

  public horizontalAlignment!: SkyPopoverAlignment;

  public isOpen = false;

  public placement: SkyPopoverPlacement | null = null;

  public popoverTitle: string | undefined;

  public popoverType!: SkyPopoverType;

  public themeName: string | undefined;

  @ViewChild('arrowRef', {
    read: ElementRef,
    static: true,
  })
  private arrowRef!: ElementRef;

  @ViewChild('popoverRef', {
    read: ElementRef,
    static: true,
  })
  private popoverRef!: ElementRef;

  @ViewChild('contentTarget', {
    read: ViewContainerRef,
    static: true,
  })
  private contentTarget!: ViewContainerRef;

  private caller!: ElementRef;

  private ngUnsubscribe = new Subject<void>();

  private _closed = new Subject<void>();

  private _isMouseEnter = new Subject<boolean>();

  private _opened = new Subject<void>();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private affixService: SkyAffixService,
    private coreAdapterService: SkyCoreAdapterService,
    private adapterService: SkyPopoverAdapterService,
    private context: SkyPopoverContext,
    @Optional() private themeSvc?: SkyThemeService
  ) {}

  public ngOnInit(): void {
    this.contentTarget.createEmbeddedView(this.context.contentTemplateRef);
    this.addEventListeners();

    /*istanbul ignore else*/
    if (this.themeSvc) {
      this.themeSvc.settingsChange
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((themeSettings) => {
          /*istanbul ignore next*/
          this.themeName = themeSettings.currentSettings?.theme?.name;
        });
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this._closed.complete();
    this._isMouseEnter.complete();
    this._opened.complete();

    /* istanbul ignore else */
    if (this.affixer) {
      this.affixer.destroy();
      this.affixer = undefined;
    }
  }

  public onAnimationEvent(event: AnimationEvent): void {
    if (event.fromState === 'void') {
      return;
    }

    if (event.phaseName === 'done') {
      if (event.toState === 'open') {
        this._opened.next();
      } else {
        this._closed.next();
      }
    }
  }

  public open(
    caller: ElementRef,
    config: {
      dismissOnBlur: boolean;
      enableAnimations: boolean;
      horizontalAlignment: SkyPopoverAlignment;
      isStatic: boolean;
      placement: SkyPopoverPlacement;
      popoverTitle?: string;
      popoverType: SkyPopoverType;
    }
  ): void {
    this.caller = caller;
    this.dismissOnBlur = config.dismissOnBlur;
    this.enableAnimations = config.enableAnimations;
    this.horizontalAlignment = config.horizontalAlignment;
    this.placement = config.placement;
    this.popoverTitle = config.popoverTitle;
    this.popoverType = config.popoverType;

    this.changeDetector.markForCheck();

    // Indicates if the popover should be displayed statically.
    // Please note: This feature is internal-only and used by the visual tests to capture multiple
    // states simultaneously without the overhead of event listeners.
    /* istanbul ignore if */
    if (config.isStatic) {
      this.isOpen = true;
      this.changeDetector.markForCheck();
      return;
    }

    // Let the styles render before gauging the affix dimensions.
    setTimeout(() => {
      if (!this.popoverRef.nativeElement || this.ngUnsubscribe.isStopped) {
        return;
      }

      if (!this.affixer) {
        this.setupAffixer();
      }

      const affixOptions: SkyAffixConfig = {
        autoFitContext: SkyAffixAutoFitContext.Viewport,
        enableAutoFit: true,
        horizontalAlignment: parseAffixHorizontalAlignment(
          this.horizontalAlignment
        ),
        isSticky: true,
        placement: parseAffixPlacement(this.placement as SkyPopoverPlacement),
      };

      // Ensure vertical alignment is set according to the popover's placement value.
      if (
        affixOptions.placement === 'left' ||
        affixOptions.placement === 'right'
      ) {
        affixOptions.verticalAlignment = 'middle';
      }

      this.affixer!.affixTo(this.caller.nativeElement, affixOptions);

      this.updateArrowOffset();

      this.isOpen = true;
      this.changeDetector.markForCheck();
    });
  }

  public close(): void {
    this.isOpen = false;
    this.changeDetector.markForCheck();
  }

  public applyFocus(): void {
    if (this.isOpen) {
      this.coreAdapterService.getFocusableChildrenAndApplyFocus(
        this.popoverRef,
        '.sky-popover',
        true
      );
    }
  }

  private setupAffixer(): void {
    const affixer = this.affixService.createAffixer(this.popoverRef);

    affixer.offsetChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.updateArrowOffset();
      this.changeDetector.markForCheck();
    });

    affixer.overflowScroll.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.updateArrowOffset();
      this.changeDetector.markForCheck();
    });

    affixer.placementChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((change) => {
        this.placement = change.placement;
        this.changeDetector.markForCheck();
      });

    this.affixer = affixer;
  }

  private updateArrowOffset(): void {
    if (this.placement) {
      const { top, left } = this.adapterService.getArrowCoordinates(
        {
          caller: this.caller,
          popover: this.popoverRef,
          popoverArrow: this.arrowRef,
        },
        this.placement,
        this.themeName
      );

      this.arrowTop = top;
      this.arrowLeft = left;
    }
  }

  private isFocusLeavingElement(event: KeyboardEvent): boolean {
    const focusableItems = this.coreAdapterService.getFocusableChildren(
      this.elementRef.nativeElement
    );

    const isFirstItem = focusableItems[0] === event.target && event.shiftKey;

    const isLastItem =
      focusableItems[focusableItems.length - 1] === event.target &&
      !event.shiftKey;

    return focusableItems.length === 0 || isFirstItem || isLastItem;
  }

  private addEventListeners(): void {
    const hostElement = this.elementRef.nativeElement;

    observableFromEvent(hostElement, 'mouseenter')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this._isMouseEnter.next(true));

    observableFromEvent(hostElement, 'mouseleave')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this._isMouseEnter.next(false));

    observableFromEvent<KeyboardEvent>(hostElement, 'keydown')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event) => {
        const key = event.key.toLowerCase();

        switch (key) {
          case 'escape':
            this.close();
            this.caller.nativeElement.focus();
            event.preventDefault();
            event.stopPropagation();
            break;

          // Since the popover now lives in an overlay at the bottom of the document body, we need
          // to handle the tab key ourselves. Otherwise, focus would be moved to the browser's
          // search bar.
          case 'tab':
            if (!this.dismissOnBlur) {
              return;
            }

            /*istanbul ignore else*/
            if (this.isFocusLeavingElement(event)) {
              this.close();
              this.caller.nativeElement.focus();
              event.preventDefault();
              event.stopPropagation();
            }
            break;
        }
      });
  }
}
