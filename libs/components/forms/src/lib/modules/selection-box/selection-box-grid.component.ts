import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  MutationObserverService,
  SkyCoreAdapterService,
  SkyMediaBreakpoints,
} from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkySelectionBoxAdapterService } from './selection-box-adapter.service';
import { SkySelectionBoxComponent } from './selection-box.component';
import { SkySelectionBoxGridAlignItemsType } from './types/selection-box-grid-align-items-type';

const SKY_SELECTION_BOX_CLASS_NAME = '.sky-selection-box';

/**
 * Creates a grid layout for an array of selection boxes.
 */
@Component({
  selector: 'sky-selection-box-grid',
  templateUrl: './selection-box-grid.component.html',
  styleUrls: ['./selection-box-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SkySelectionBoxGridComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  /**
   * @internal
   * Specifies how to display the selection boxes in the grid.
   * @default 'center'
   */
  @Input()
  public set alignItems(value: SkySelectionBoxGridAlignItemsType | undefined) {
    if (value) {
      this.#_alignItems = value;
    } else {
      this.#_alignItems = 'center';
    }
  }

  public get alignItems(): SkySelectionBoxGridAlignItemsType {
    return this.#_alignItems;
  }

  @ContentChildren(SkySelectionBoxComponent, {
    read: SkySelectionBoxComponent,
  })
  public selectionBoxes: QueryList<SkySelectionBoxComponent> | undefined;

  set #currentBreakpoint(value: SkyMediaBreakpoints) {
    if (value !== this.#_currentBreakpoint) {
      this.#_currentBreakpoint = value;
      this.#selectionBoxAdapter.setResponsiveClass(
        this.containerElementRef,
        value
      );
      this.#updateChildrenHeights();
    }
  }

  @ViewChild('container', {
    read: ElementRef,
    static: true,
  })
  public containerElementRef!: ElementRef<any>;

  #mutationObserver: MutationObserver | undefined;

  #ngUnsubscribe = new Subject<void>();

  #_alignItems: SkySelectionBoxGridAlignItemsType = 'center';

  #_currentBreakpoint: SkyMediaBreakpoints | undefined;

  #coreAdapterService: SkyCoreAdapterService;
  #selectionBoxAdapter: SkySelectionBoxAdapterService;
  #hostElRef: ElementRef;
  #mutationObserverSvc: MutationObserverService;
  #ngZone: NgZone;
  #themeSvc: SkyThemeService | undefined;

  constructor(
    coreAdapterService: SkyCoreAdapterService,
    selectionBoxAdapter: SkySelectionBoxAdapterService,
    hostElRef: ElementRef,
    mutationObserverSvc: MutationObserverService,
    ngZone: NgZone,
    @Optional() themeSvc?: SkyThemeService
  ) {
    this.#coreAdapterService = coreAdapterService;
    this.#selectionBoxAdapter = selectionBoxAdapter;
    this.#hostElRef = hostElRef;
    this.#mutationObserverSvc = mutationObserverSvc;
    this.#ngZone = ngZone;
    this.#themeSvc = themeSvc;
  }

  public ngOnInit(): void {
    /* istanbul ignore else */
    if (this.#themeSvc) {
      this.#themeSvc.settingsChange
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.#updateBreakpointClass();
          this.#updateChildrenHeights();
        });
    }
  }

  public ngAfterViewInit(): void {
    this.#updateBreakpointClass();
    this.#updateChildrenHeights();
    this.#initMutationObserver();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    this.#destroyMutationObserver();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    this.#updateBreakpointClass();
  }

  #initMutationObserver(): void {
    /* istanbul ignore else */
    if (!this.#mutationObserver) {
      const el = this.containerElementRef.nativeElement;

      // MutationObserver is patched by Zone.js and therefore becomes part of the
      // Angular change detection cycle, but this can lead to infinite loops in some
      // scenarios. This will keep MutationObserver from triggering change detection.
      this.#ngZone.runOutsideAngular(() => {
        this.#mutationObserver = this.#mutationObserverSvc.create(() => {
          this.#updateChildrenHeights();
        });

        this.#mutationObserver.observe(el, {
          characterData: true,
          subtree: true,
        });
      });
    }
  }

  #destroyMutationObserver(): void {
    /* istanbul ignore else */
    if (this.#mutationObserver) {
      this.#mutationObserver.disconnect();
      this.#mutationObserver = undefined;
    }
  }

  #updateBreakpointClass(): void {
    const parentWidth = this.#selectionBoxAdapter.getParentWidth(
      this.#hostElRef
    );
    this.#currentBreakpoint =
      this.#selectionBoxAdapter.getBreakpointForWidth(parentWidth);
  }

  #updateChildrenHeights(): void {
    this.#coreAdapterService.resetHeight(
      this.containerElementRef,
      SKY_SELECTION_BOX_CLASS_NAME
    );
    this.#coreAdapterService.syncMaxHeight(
      this.containerElementRef,
      SKY_SELECTION_BOX_CLASS_NAME
    );
  }
}
