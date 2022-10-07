import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
} from '@angular/core';

import { IHeaderAngularComp } from 'ag-grid-angular';
import { Events } from 'ag-grid-community';
import { BehaviorSubject, Subscription, fromEvent } from 'rxjs';

import { SkyAgGridHeaderInfo } from '../types/header-info';
import { SkyAgGridHeaderParams } from '../types/header-params';

import { SkyAgGridHeader } from './header-token';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridHeaderComponent implements IHeaderAngularComp, OnDestroy {
  public params: SkyAgGridHeaderParams | undefined = undefined;
  public sorted = '';
  public componentPortal: ComponentPortal<unknown> | undefined = undefined;
  public readonly filterEnabled$ = new BehaviorSubject<boolean>(false);
  public readonly sortOrder$ = new BehaviorSubject<'asc' | 'desc' | undefined>(
    undefined
  );
  public readonly sortIndexDisplay$ = new BehaviorSubject<string>('');

  #subscriptions = new Subscription();
  readonly #changeDetector: ChangeDetectorRef;
  readonly #injector: Injector;

  constructor(changeDetector: ChangeDetectorRef, injector: Injector) {
    this.#changeDetector = changeDetector;
    this.#injector = injector;
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  public agInit(params: SkyAgGridHeaderParams): void {
    this.params = params;
    this.#subscriptions.unsubscribe();
    if (!this.params) {
      return;
    }
    this.#subscriptions = new Subscription();
    if (params.column.isFilterAllowed()) {
      this.#subscriptions.add(
        fromEvent(params.column, 'filterChanged').subscribe(() => {
          const isFilterActive = params.column.isFilterActive();
          if (isFilterActive !== this.filterEnabled$.getValue()) {
            this.filterEnabled$.next(isFilterActive);
          }
        })
      );
    }
    if (params.enableSorting) {
      // Column sort state changes
      this.#subscriptions.add(
        fromEvent(params.column, Events.EVENT_SORT_CHANGED).subscribe(() => {
          this.#updateSort();
        })
      );
      // Other column sort state changes, for multi-column sorting
      this.#subscriptions.add(
        fromEvent(params.api, Events.EVENT_SORT_CHANGED).subscribe(() => {
          this.#updateSortIndex();
        })
      );
      this.#updateSort();
      this.#updateSortIndex();
    }
    if (params.inlineHelpComponent) {
      this.componentPortal = new ComponentPortal(
        params.inlineHelpComponent,
        null,
        Injector.create({
          providers: [
            {
              provide: SkyAgGridHeader,
              useValue: {
                column: params.column,
                context: params.context,
                displayName: params.displayName,
              } as SkyAgGridHeaderInfo,
            },
          ],
          parent: this.#injector,
        })
      );
    } else {
      this.componentPortal = undefined;
    }
    this.#changeDetector.markForCheck();
  }

  public onMenuClick($event: Event): void {
    this.params.showColumnMenu($event.target as HTMLElement);
  }

  public onSortRequested(event): void {
    this.params.progressSort(!!event.shiftKey);
  }

  public refresh(params: SkyAgGridHeaderParams): boolean {
    this.agInit(params);
    return false;
  }

  #updateSort(): void {
    this.sortOrder$.next(this.params.column.getSort() || undefined);
  }

  #updateSortIndex(): void {
    const sortIndex = this.params.column.getSortIndex();
    const otherSortColumns = this.params.columnApi
      .getAllColumns()
      .some(
        (column) =>
          column.getColId() !== this.params.column.getColId() &&
          !!column.getSort()
      );
    if (sortIndex !== undefined && sortIndex !== null && otherSortColumns) {
      this.sortIndexDisplay$.next(`${sortIndex + 1}`);
    } else {
      this.sortIndexDisplay$.next('');
    }
  }
}
