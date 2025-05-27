import { AsyncPipe } from '@angular/common';
import type { AfterViewInit, ComponentRef, OnDestroy } from '@angular/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EnvironmentInjector,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  SkyDynamicComponentLocation,
  SkyDynamicComponentService,
} from '@skyux/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import type { IHeaderAngularComp } from 'ag-grid-angular';
import type { ColumnMovedEvent } from 'ag-grid-community';
import { BehaviorSubject, Subscription, fromEvent, takeUntil } from 'rxjs';

import { SkyAgGridHeaderInfo } from '../types/header-info';
import type { SkyAgGridHeaderParams } from '../types/header-params';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.title]': 'accessibleHeaderText()',
    '[attr.aria-label]': 'displayName() || accessibleHeaderText()',
    '[attr.role]': '"note"',
  },
  imports: [SkyIconModule, SkyThemeModule, AsyncPipe, SkyI18nModule],
})
export class SkyAgGridHeaderComponent
  implements IHeaderAngularComp, OnDestroy, AfterViewInit
{
  public readonly filterEnabled$ = new BehaviorSubject<boolean>(false);

  // For accessibility, we need to set the title attribute on the header element if there is no visible header text.
  // https://dequeuniversity.com/rules/axe/4.5/empty-table-header?application=axeAPI
  protected readonly accessibleHeaderText = computed(() => {
    const params = this.params();
    if (
      params?.displayName &&
      !params?.column.getColDef().headerComponentParams?.headerHidden
    ) {
      return undefined;
    } else {
      return params?.displayName || params?.column.getColDef().field;
    }
  });

  @ViewChild('inlineHelpContainer', { read: ElementRef, static: true })
  protected inlineHelpContainer: ElementRef | undefined;

  protected readonly params = signal<SkyAgGridHeaderParams | undefined>(
    undefined,
  );
  protected sorted = '';
  protected readonly sortOrder$ = new BehaviorSubject<
    'asc' | 'desc' | undefined
  >(undefined);
  protected readonly sortIndexDisplay$ = new BehaviorSubject<string>('');

  protected displayName = computed<string | undefined>(() => {
    const params = this.params();
    if (
      params?.displayName &&
      !params?.column.getColDef().headerComponentParams?.headerHidden
    ) {
      return params.displayName;
    } else {
      return undefined;
    }
  });

  #subscriptions = new Subscription();
  #inlineHelpComponentRef: ComponentRef<unknown> | undefined;
  #viewInitialized = false;
  #agInitialized = false;
  #leftPosition = 0;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dynamicComponentService = inject(SkyDynamicComponentService);
  readonly #environmentInjector = inject(EnvironmentInjector);

  public ngAfterViewInit(): void {
    this.#viewInitialized = true;
    this.#updateInlineHelp();
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  public agInit(params: SkyAgGridHeaderParams | undefined): void {
    this.#agInitialized = true;
    this.params.set(params);
    this.#subscriptions.unsubscribe();
    if (!params) {
      return;
    }
    this.#leftPosition = params.column.getLeft() ?? 0;
    this.#subscriptions = new Subscription();
    if (params.column.isFilterAllowed()) {
      this.#subscriptions.add(
        fromEvent(params.column, 'filterChanged')
          .pipe(takeUntil(fromEvent(params.api, 'gridPreDestroyed')))
          .subscribe(() => {
            const isFilterActive = params.column.isFilterActive();
            if (isFilterActive !== this.filterEnabled$.getValue()) {
              this.filterEnabled$.next(isFilterActive);
            }
          }),
      );
    }
    if (params.enableSorting) {
      // Column sort state changes
      this.#subscriptions.add(
        fromEvent(params.column, 'sortChanged')
          .pipe(takeUntil(fromEvent(params.api, 'gridPreDestroyed')))
          .subscribe(() => {
            this.#updateSort();
          }),
      );
      // Other column sort state changes, for multi-column sorting
      this.#subscriptions.add(
        fromEvent(params.api, 'sortChanged')
          .pipe(takeUntil(fromEvent(params.api, 'gridPreDestroyed')))
          .subscribe(() => {
            this.#updateSortIndex();
          }),
      );
      this.#updateSort();
      this.#updateSortIndex();
    }

    // When the column is moved left via the keyboard, the element is detached
    // and reattached to the DOM to maintain DOM order, and its focus is lost.
    this.#subscriptions.add(
      fromEvent<ColumnMovedEvent>(params.api, 'columnMoved')
        .pipe(takeUntil(fromEvent(params.api, 'gridPreDestroyed')))
        .subscribe((event) => {
          const left = event.column?.getLeft() ?? 0;
          const oldLeft = this.#leftPosition;
          if (
            event.column === params.column &&
            event.source === 'uiColumnMoved' &&
            left < oldLeft
          ) {
            params.eGridHeader.focus();
          }
          this.#leftPosition = left;
        }),
    );

    this.#updateInlineHelp();
    this.#changeDetector.markForCheck();
  }

  public onMenuClick($event: Event): void {
    this.params()?.showColumnMenu($event.target as HTMLElement);
  }

  public onSortRequested(event: MouseEvent): void {
    if (this.params()?.enableSorting) {
      this.params()?.progressSort(event.shiftKey);
    }
  }

  public refresh(params: SkyAgGridHeaderParams): boolean {
    this.agInit(params);
    return false;
  }

  #updateInlineHelp(): void {
    if (!this.#viewInitialized || !this.#agInitialized) {
      return;
    }

    const inlineHelpComponent = this.params()?.inlineHelpComponent;

    if (
      inlineHelpComponent &&
      (!this.#inlineHelpComponentRef ||
        this.#inlineHelpComponentRef.componentType !== inlineHelpComponent)
    ) {
      this.#dynamicComponentService.removeComponent(
        this.#inlineHelpComponentRef,
      );

      const headerInfo = new SkyAgGridHeaderInfo();
      headerInfo.column = this.params()?.column;
      headerInfo.context = this.params()?.context;
      headerInfo.displayName = this.params()?.displayName;

      this.#inlineHelpComponentRef =
        this.#dynamicComponentService.createComponent(inlineHelpComponent, {
          providers: [
            {
              provide: SkyAgGridHeaderInfo,
              useValue: headerInfo,
            },
          ],
          environmentInjector: this.#environmentInjector,
          referenceEl: this.inlineHelpContainer?.nativeElement,
          location: SkyDynamicComponentLocation.ElementBottom,
        });
    } else if (!inlineHelpComponent) {
      this.#dynamicComponentService.removeComponent(
        this.#inlineHelpComponentRef,
      );
    }
  }

  #updateSort(): void {
    this.sortOrder$.next(this.params()?.column.getSort() || undefined);
  }

  #updateSortIndex(): void {
    const sortIndex = this.params()?.column.getSortIndex();
    const otherSortColumns = this.params()
      ?.api?.getColumns()
      ?.some(
        (column) =>
          column.getColId() !== this.params()?.column.getColId() &&
          !!column.getSort(),
      );
    if (sortIndex !== undefined && sortIndex !== null && otherSortColumns) {
      this.sortIndexDisplay$.next(`${sortIndex + 1}`);
    } else {
      this.sortIndexDisplay$.next('');
    }
  }
}
