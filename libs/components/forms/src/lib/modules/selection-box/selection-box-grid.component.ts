import {
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
import { SkyCoreAdapterService, SkyMutationObserverService } from '@skyux/core';
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
  standalone: false,
})
export class SkySelectionBoxGridComponent implements OnDestroy, OnInit {
  /**
   * @internal
   * How to display the selection boxes in the grid.
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

  @ViewChild('container', {
    read: ElementRef,
    static: true,
  })
  public set containerElementRef(value: ElementRef | undefined) {
    this.#_containerElementRef = value;
    this.#destroyMutationObserver();
    if (value) {
      this.#updateBreakpointClass();
      this.#initMutationObserver();
    }
  }

  public get containerElementRef(): ElementRef | undefined {
    return this.#_containerElementRef;
  }

  #mutationObserver: MutationObserver | undefined;

  #ngUnsubscribe = new Subject<void>();

  #_alignItems: SkySelectionBoxGridAlignItemsType = 'center';

  #_containerElementRef: ElementRef | undefined;

  #coreAdapterService: SkyCoreAdapterService;
  #selectionBoxAdapter: SkySelectionBoxAdapterService;
  #hostElRef: ElementRef;
  #mutationObserverSvc: SkyMutationObserverService;
  #ngZone: NgZone;
  #themeSvc: SkyThemeService | undefined;

  constructor(
    coreAdapterService: SkyCoreAdapterService,
    selectionBoxAdapter: SkySelectionBoxAdapterService,
    hostElRef: ElementRef,
    mutationObserverSvc: SkyMutationObserverService,
    ngZone: NgZone,
    @Optional() themeSvc?: SkyThemeService,
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
        });
    }
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
    if (!this.#mutationObserver && this.containerElementRef) {
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
      this.#hostElRef,
    );

    if (this.containerElementRef) {
      this.#selectionBoxAdapter.setResponsiveClass(
        this.containerElementRef,
        this.#selectionBoxAdapter.getBreakpointForWidth(parentWidth),
      );
    }
    this.#updateChildrenHeights();
  }

  #updateChildrenHeights(): void {
    if (this.containerElementRef) {
      this.#coreAdapterService.resetHeight(
        this.containerElementRef,
        SKY_SELECTION_BOX_CLASS_NAME,
      );
      this.#coreAdapterService.syncMaxHeight(
        this.containerElementRef,
        SKY_SELECTION_BOX_CLASS_NAME,
      );
    }
  }
}
