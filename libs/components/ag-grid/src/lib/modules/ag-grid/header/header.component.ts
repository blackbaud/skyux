import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  SkyDynamicComponentLocation,
  SkyDynamicComponentOptions,
  SkyDynamicComponentService,
} from '@skyux/core';

import { IHeaderAngularComp } from 'ag-grid-angular';
import { Events } from 'ag-grid-community';
import { BehaviorSubject, Subscription, fromEvent } from 'rxjs';

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
  @ViewChild('inlineHelpContainer', { read: ElementRef, static: true })
  public inlineHelpContainer: ElementRef;

  public params: SkyAgGridHeaderParams | undefined = undefined;
  public sorted = '';
  public readonly filterEnabled$ = new BehaviorSubject<boolean>(false);
  public readonly sortOrder$ = new BehaviorSubject<'asc' | 'desc' | undefined>(
    undefined
  );
  public readonly sortIndexDisplay$ = new BehaviorSubject<string>('');

  #subscriptions = new Subscription();
  readonly #changeDetector: ChangeDetectorRef;
  readonly #dynamicComponentService: SkyDynamicComponentService;
  #inlineHelpComponentRef: ComponentRef<unknown> | undefined;
  #viewInitialized = false;
  #agIntialized = false;

  constructor(
    changeDetector: ChangeDetectorRef,
    dynamicComponentService: SkyDynamicComponentService
  ) {
    this.#changeDetector = changeDetector;
    this.#dynamicComponentService = dynamicComponentService;
  }

  public ngAfterViewInit(): void {
    this.#viewInitialized = true;
    this.#updateInlineHelp();
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  public agInit(params: SkyAgGridHeaderParams): void {
    this.#agIntialized = true;
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
    this.#updateInlineHelp();
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

  #updateInlineHelp(): void {
    if (!this.#viewInitialized || !this.#agIntialized) {
      return;
    }
    const inlineHelpComponent = this.params.inlineHelpComponent;
    if (
      inlineHelpComponent &&
      (!this.#inlineHelpComponentRef ||
        this.#inlineHelpComponentRef.componentType !== inlineHelpComponent)
    ) {
      this.#dynamicComponentService.removeComponent(
        this.#inlineHelpComponentRef
      );
      this.#inlineHelpComponentRef =
        this.#dynamicComponentService.createComponent(inlineHelpComponent, {
          providers: [
            {
              provide: SkyAgGridHeaderInfo,
              useValue: {
                column: this.params.column,
                context: this.params.context,
                displayName: this.params.displayName,
              } as SkyAgGridHeaderInfo,
            },
          ],
          referenceEl: this.inlineHelpContainer.nativeElement,
          location: SkyDynamicComponentLocation.ElementBottom,
        } as SkyDynamicComponentOptions);
    } else if (!inlineHelpComponent) {
      this.#dynamicComponentService.removeComponent(
        this.#inlineHelpComponentRef
      );
    }
  }

  #updateSort(): void {
    this.sortOrder$.next(this.params.column.getSort() || undefined);
  }

  #updateSortIndex(): void {
    const sortIndex = this.params.column.getSortIndex();
    const otherSortColumns = this.params.columnApi
      .getColumns()
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
