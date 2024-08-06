import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  HostBinding,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import {
  SkyDynamicComponentLocation,
  SkyDynamicComponentService,
} from '@skyux/core';

import { IHeaderAngularComp } from 'ag-grid-angular';
import { ColumnMovedEvent } from 'ag-grid-community';
import { BehaviorSubject, Subscription, fromEventPattern } from 'rxjs';

import { SkyAgGridHeaderInfo } from '../types/header-info';
import { SkyAgGridHeaderParams } from '../types/header-params';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridHeaderComponent
  implements IHeaderAngularComp, OnDestroy, AfterViewInit
{
  // For accessibility, we need to set the title attribute on the header element if there is not a display name.
  // https://dequeuniversity.com/rules/axe/4.5/empty-table-header?application=axeAPI
  @HostBinding('attr.title')
  public columnLabel: string | undefined;

  @ViewChild('inlineHelpContainer', { read: ElementRef, static: true })
  public inlineHelpContainer: ElementRef | undefined;

  public params: SkyAgGridHeaderParams | undefined = undefined;
  public sorted = '';
  public readonly filterEnabled$ = new BehaviorSubject<boolean>(false);
  public readonly sortOrder$ = new BehaviorSubject<'asc' | 'desc' | undefined>(
    undefined,
  );
  public readonly sortIndexDisplay$ = new BehaviorSubject<string>('');

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
    this.params = params;
    this.#subscriptions.unsubscribe();
    if (!params) {
      return;
    }
    this.#leftPosition = params.column.getLeft() ?? 0;
    this.columnLabel = params.displayName
      ? undefined
      : params.column.getColDef().field;
    this.#subscriptions = new Subscription();
    if (params.column.isFilterAllowed()) {
      this.#subscriptions.add(
        fromEventPattern(
          (handler) => params.column.addEventListener('filterChanged', handler),
          (handler) =>
            params.column.removeEventListener('filterChanged', handler),
        ).subscribe(() => {
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
        fromEventPattern(
          (handler) => params.column.addEventListener('sortChanged', handler),
          (handler) =>
            params.column.removeEventListener('sortChanged', handler),
        ).subscribe(() => {
          this.#updateSort();
        }),
      );
      // Other column sort state changes, for multi-column sorting
      this.#subscriptions.add(
        fromEventPattern(
          (handler) => params.api.addEventListener('sortChanged', handler),
          (handler) => params.api.removeEventListener('sortChanged', handler),
        ).subscribe(() => {
          this.#updateSortIndex();
        }),
      );
      this.#updateSort();
      this.#updateSortIndex();
    }

    // When the column is moved left via the keyboard, the element is detached
    // and reattached to the DOM to maintain DOM order, and its focus is lost.
    this.#subscriptions.add(
      fromEventPattern<ColumnMovedEvent>(
        (handler) => params.api.addEventListener('columnMoved', handler),
        (handler) => params.api.removeEventListener('columnMoved', handler),
      ).subscribe((event) => {
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
    this.params?.showColumnMenu($event.target as HTMLElement);
  }

  public onSortRequested(event: MouseEvent): void {
    if (this.params?.enableSorting) {
      this.params?.progressSort(event.shiftKey);
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

    const inlineHelpComponent = this.params?.inlineHelpComponent;

    if (
      inlineHelpComponent &&
      (!this.#inlineHelpComponentRef ||
        this.#inlineHelpComponentRef.componentType !== inlineHelpComponent)
    ) {
      this.#dynamicComponentService.removeComponent(
        this.#inlineHelpComponentRef,
      );

      const headerInfo = new SkyAgGridHeaderInfo();
      headerInfo.column = this.params?.column;
      headerInfo.context = this.params?.context;
      headerInfo.displayName = this.params?.displayName;

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
    this.sortOrder$.next(this.params?.column.getSort() || undefined);
  }

  #updateSortIndex(): void {
    const sortIndex = this.params?.column.getSortIndex();
    const otherSortColumns = this.params?.api
      ?.getColumns()
      ?.some(
        (column) =>
          column.getColId() !== this.params?.column.getColId() &&
          !!column.getSort(),
      );
    if (sortIndex !== undefined && sortIndex !== null && otherSortColumns) {
      this.sortIndexDisplay$.next(`${sortIndex + 1}`);
    } else {
      this.sortIndexDisplay$.next('');
    }
  }
}
