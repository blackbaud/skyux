import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
} from '@angular/core';

import { IHeaderAngularComp } from 'ag-grid-angular';
import { BehaviorSubject, Subscription, fromEvent } from 'rxjs';

import { SkyAgGridHeaderAppendComponentParams } from '../types/header-append-component-params';
import { SkyAgGridHeaderParams } from '../types/header-params';

import { SkyAgGridHeaderAppendComponent } from './header-params-token';

/**
 * Custom header component for adding inline help to Data Grid and Data Entry Grid column headers. To display a help
 * button beside the column header, create a component that includes the help button element, such as `sky-help-inline`,
 * optionally including `@Inject(SkyAgGridHeaderAppendComponent)` in the constructor to access information such as the
 * column header's display name. Then, add the component to the `headerComponentParams.headerAppendComponent` property
 * of the column definition like this:
 *
 * ```typescript
 * headerComponent: SkyAgGridHeaderComponent,
 * headerComponentParams: {
 *   headerAppendComponent: MyHelpButtonComponent,
 * },
 * ```
 */
@Component({
  selector: 'sky-ag-grid-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridHeaderComponent implements IHeaderAngularComp {
  public params: SkyAgGridHeaderParams | undefined = undefined;
  public sorted = '';
  public componentPortal: ComponentPortal<unknown> | undefined = undefined;
  public readonly filterEnabled$ = new BehaviorSubject<boolean>(false);
  public readonly sortOrder$ = new BehaviorSubject<'asc' | 'desc' | undefined>(
    undefined
  );
  public readonly sortIndexDisplay$ = new BehaviorSubject<string>('');

  #changeDetector: ChangeDetectorRef;
  #subscriptions = new Subscription();
  #nativeElement: HTMLElement;
  #injector: Injector;

  constructor(
    changeDetector: ChangeDetectorRef,
    { nativeElement }: ElementRef,
    injector: Injector
  ) {
    this.#changeDetector = changeDetector;
    this.#nativeElement = nativeElement;
    this.#injector = injector;
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
      this.#subscriptions.add(
        fromEvent(params.column, 'sortChanged').subscribe(() => {
          this.#updateSort();
        })
      );
      this.#subscriptions.add(
        fromEvent(params.api, 'sortChanged').subscribe(() => {
          this.#updateSortIndex();
        })
      );
      this.#updateSort();
      this.#updateSortIndex();
    }
    if (params.headerAppendComponent) {
      this.componentPortal = new ComponentPortal(
        params.headerAppendComponent,
        null,
        Injector.create({
          providers: [
            {
              provide: SkyAgGridHeaderAppendComponent,
              useValue: {
                api: params.api,
                column: params.column,
                columnApi: params.columnApi,
                context: params.context,
                displayName: params.displayName,
              } as SkyAgGridHeaderAppendComponentParams,
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

  public onMenuClick($event: Event) {
    this.params.showColumnMenu($event.target as HTMLElement);
  }

  public onSortRequested(event) {
    this.params.progressSort(!!event.shiftKey);
  }

  public refresh(params: SkyAgGridHeaderParams): boolean {
    this.agInit(params);
    return false;
  }

  #updateSort() {
    this.sortOrder$.next(this.params.column.getSort() || undefined);
    this.#nativeElement.classList.toggle(
      'ag-sort-ascending-icon',
      this.params.column.isSortAscending()
    );
    this.#nativeElement.classList.toggle(
      'ag-sort-descending-icon',
      this.params.column.isSortDescending()
    );
    this.#nativeElement.classList.toggle(
      'ag-sort-mixed-icon',
      Number.isInteger(this.params.column.getSortIndex())
    );
    this.#nativeElement.classList.toggle(
      'ag-sort-none-icon',
      this.params.column.isSortNone()
    );
  }

  #updateSortIndex() {
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
