import { AnimationEvent } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
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

import {
  Observable,
  Subject,
  animationFrameScheduler,
  debounceTime,
  distinctUntilChanged,
  map,
  fromEvent as observableFromEvent,
  takeUntil,
} from 'rxjs';

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
  standalone: false,
})
export class SkyPopoverContentComponent implements OnInit, OnDestroy {
  @HostBinding('id')
  protected popoverId: string | undefined;

  public animationState: SkyPopoverAnimationState = 'closed';

  public get closed(): Observable<void> {
    return this.#_closed.asObservable();
  }

  public get opened(): Observable<void> {
    return this.#_opened.asObservable();
  }

  public get isMouseEnter(): Observable<boolean> {
    return this.#_isMouseEnter.asObservable();
  }

  public affixer: SkyAffixer | undefined;

  public enableAnimations = true;

  public horizontalAlignment: SkyPopoverAlignment = 'center';

  public set isOpen(value: boolean) {
    this.#_isOpen = value;
    this.animationState = value ? 'open' : 'closed';
  }

  public get isOpen(): boolean {
    return this.#_isOpen;
  }

  public placement: SkyPopoverPlacement | null = null;

  public popoverTitle: string | undefined;

  public popoverType: SkyPopoverType = 'info';

  public themeName: string | undefined;

  @ViewChild('arrowRef', {
    read: ElementRef,
    static: true,
  })
  public arrowRef: ElementRef | undefined;

  @ViewChild('popoverRef', {
    read: ElementRef,
    static: true,
  })
  public popoverRef: ElementRef | undefined;

  @ViewChild('contentTarget', {
    read: ViewContainerRef,
    static: true,
  })
  public set contentTarget(value: ViewContainerRef | undefined) {
    if (value) {
      value.createEmbeddedView(this.#context.contentTemplateRef);
    }
  }

  #caller: ElementRef | undefined;

  #ngUnsubscribe = new Subject<void>();

  #_closed = new Subject<void>();

  #_isMouseEnter = new Subject<boolean>();

  #_isOpen = false;

  #_opened = new Subject<void>();

  #changeDetector: ChangeDetectorRef;
  #elementRef: ElementRef;
  #affixService: SkyAffixService;
  #arrowAffixer: SkyAffixer | undefined;
  #coreAdapterService: SkyCoreAdapterService;
  #context: SkyPopoverContext;
  #themeSvc: SkyThemeService | undefined;

  constructor(
    changeDetector: ChangeDetectorRef,
    elementRef: ElementRef,
    affixService: SkyAffixService,
    coreAdapterService: SkyCoreAdapterService,
    context: SkyPopoverContext,
    @Optional() themeSvc?: SkyThemeService,
  ) {
    this.#changeDetector = changeDetector;
    this.#elementRef = elementRef;
    this.#affixService = affixService;
    this.#coreAdapterService = coreAdapterService;
    this.#context = context;
    this.#themeSvc = themeSvc;
  }

  public hasFocusableContent(): boolean {
    return (
      this.#coreAdapterService.getFocusableChildren(
        this.popoverRef?.nativeElement,
      ).length > 0
    );
  }

  public ngOnInit(): void {
    this.#addEventListeners();

    /*istanbul ignore else*/
    if (this.#themeSvc) {
      this.#themeSvc.settingsChange
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((themeSettings) => {
          /*istanbul ignore next*/
          this.themeName = themeSettings.currentSettings?.theme?.name;
        });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    this.#_closed.complete();
    this.#_isMouseEnter.complete();
    this.#_opened.complete();

    /* istanbul ignore else */
    if (this.affixer) {
      this.affixer.destroy();
      this.affixer = undefined;
    }

    /* istanbul ignore else */
    if (this.#arrowAffixer) {
      this.#arrowAffixer.destroy();
      this.#arrowAffixer = undefined;
    }
  }

  public onAnimationEvent(event: AnimationEvent): void {
    if (event.fromState === 'void') {
      return;
    }

    if (event.phaseName === 'done') {
      if (event.toState === 'open') {
        this.#_opened.next();
      } else {
        this.#_closed.next();
      }
    }
  }

  public open(
    caller: ElementRef,
    config: {
      enableAnimations: boolean;
      horizontalAlignment: SkyPopoverAlignment;
      id: string;
      isStatic: boolean;
      placement: SkyPopoverPlacement;
      popoverTitle?: string;
      popoverType: SkyPopoverType;
    },
  ): void {
    this.#caller = caller;
    this.enableAnimations = config.enableAnimations;
    this.horizontalAlignment = config.horizontalAlignment;
    this.popoverId = config.id;
    this.placement = config.placement;
    this.popoverTitle = config.popoverTitle;
    this.popoverType = config.popoverType;

    this.#changeDetector.markForCheck();

    // Indicates if the popover should be displayed statically.
    // Please note: This feature is internal-only and used by the visual tests to capture multiple
    // states simultaneously without the overhead of event listeners.
    /* istanbul ignore if */
    if (config.isStatic) {
      this.isOpen = true;
      this.#changeDetector.markForCheck();
      return;
    }

    // Let the styles render before gauging the affix dimensions.
    setTimeout(() => {
      /* istanbul ignore if */
      if (!this.popoverRef?.nativeElement || this.#ngUnsubscribe.closed) {
        return;
      }

      if (!this.affixer) {
        this.#setupAffixer();
      }

      const affixOptions: SkyAffixConfig = {
        autoFitContext: SkyAffixAutoFitContext.Viewport,
        enableAutoFit: true,
        horizontalAlignment: parseAffixHorizontalAlignment(
          this.horizontalAlignment,
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

      this.affixer!.affixTo(this.#caller?.nativeElement, affixOptions);

      this.#updateArrowOffset();

      this.isOpen = true;
      this.#changeDetector.markForCheck();
    });
  }

  public close(): void {
    this.isOpen = false;
    this.#changeDetector.markForCheck();
  }

  public applyFocus(): void {
    if (this.popoverRef && this.isOpen) {
      this.#coreAdapterService.getFocusableChildrenAndApplyFocus(
        this.popoverRef,
        '.sky-popover',
        true,
      );
    }
  }

  #setupAffixer(): void {
    if (this.popoverRef) {
      const affixer = this.#affixService.createAffixer(this.popoverRef);

      affixer.placementChange
        .pipe(
          takeUntil(this.#ngUnsubscribe),
          debounceTime(0, animationFrameScheduler),
          map((change) => change.placement),
          distinctUntilChanged(),
        )
        .subscribe((placement) => {
          this.placement = placement;
          this.#updateArrowOffset();
          this.#changeDetector.detectChanges();
        });

      this.affixer = affixer;
    }
  }

  #updateArrowOffset(): void {
    if (this.#caller && this.arrowRef && this.placement) {
      this.#arrowAffixer?.destroy();
      this.#arrowAffixer = this.#affixService.createAffixer(this.arrowRef);
      this.#arrowAffixer.affixTo(this.#caller?.nativeElement, {
        autoFitContext: SkyAffixAutoFitContext.Viewport,
        enableAutoFit: false,
        horizontalAlignment: ['above', 'below'].includes(this.placement)
          ? 'center'
          : undefined,
        verticalAlignment: ['left', 'right'].includes(this.placement)
          ? 'middle'
          : undefined,
        isSticky: true,
        placement: parseAffixPlacement(this.placement as SkyPopoverPlacement),
        position: 'absolute',
      });
    }
  }

  #isFocusLeavingElement(event: KeyboardEvent): boolean {
    const focusableItems = this.#coreAdapterService.getFocusableChildren(
      this.#elementRef.nativeElement,
    );

    const isFirstItem = focusableItems[0] === event.target && event.shiftKey;

    const isLastItem =
      focusableItems[focusableItems.length - 1] === event.target &&
      !event.shiftKey;

    return focusableItems.length === 0 || isFirstItem || isLastItem;
  }

  #addEventListeners(): void {
    const hostElement = this.#elementRef.nativeElement;

    observableFromEvent(hostElement, 'mouseenter')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => this.#_isMouseEnter.next(true));

    observableFromEvent(hostElement, 'mouseleave')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => this.#_isMouseEnter.next(false));

    observableFromEvent<KeyboardEvent>(hostElement, 'keydown')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((event) => {
        const key = event.key.toLowerCase();

        switch (key) {
          case 'escape':
            this.close();
            this.#caller?.nativeElement.focus();
            event.preventDefault();
            event.stopPropagation();
            break;

          // Since the popover now lives in an overlay at the bottom of the document body, we need
          // to handle the tab key ourselves. Otherwise, focus would be moved to the browser's
          // search bar.
          case 'tab':
            /*istanbul ignore else*/
            if (this.#isFocusLeavingElement(event)) {
              this.close();
              this.#caller?.nativeElement.focus();
              event.preventDefault();
              event.stopPropagation();
            }
            break;
        }
      });
  }
}
