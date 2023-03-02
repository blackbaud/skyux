import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  HostBinding,
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
    undefined
  );
  public readonly sortIndexDisplay$ = new BehaviorSubject<string>('');

  #subscriptions = new Subscription();
  readonly #changeDetector: ChangeDetectorRef;
  readonly #dynamicComponentService: SkyDynamicComponentService;
  #inlineHelpComponentRef: ComponentRef<unknown> | undefined;
  #viewInitialized = false;
  #agInitialized = false;

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

  public agInit(params: SkyAgGridHeaderParams | undefined): void {
    this.#agInitialized = true;
    this.params = params;
    this.#subscriptions.unsubscribe();
    if (!params) {
      return;
    }
    this.columnLabel = params.displayName
      ? undefined
      : params.column.getColDef().field;
    this.#subscriptions = new Subscription();
    if (params.column.isFilterAllowed()) {
      this.#subscriptions.add(
        fromEventPattern(
          (handler) =>
            params.column.addEventListener(
              Events.EVENT_FILTER_CHANGED,
              handler
            ),
          (handler) =>
            params.column.removeEventListener(
              Events.EVENT_FILTER_CHANGED,
              handler
            )
        ).subscribe(() => {
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
        fromEventPattern(
          (handler) =>
            params.column.addEventListener(Events.EVENT_SORT_CHANGED, handler),
          (handler) =>
            params.column.removeEventListener(
              Events.EVENT_SORT_CHANGED,
              handler
            )
        ).subscribe(() => {
          this.#updateSort();
        })
      );
      // Other column sort state changes, for multi-column sorting
      this.#subscriptions.add(
        fromEventPattern(
          (handler) =>
            params.api.addEventListener(Events.EVENT_SORT_CHANGED, handler),
          (handler) =>
            params.api.removeEventListener(Events.EVENT_SORT_CHANGED, handler)
        ).subscribe(() => {
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
        this.#inlineHelpComponentRef
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
          referenceEl: this.inlineHelpContainer?.nativeElement,
          location: SkyDynamicComponentLocation.ElementBottom,
        } as SkyDynamicComponentOptions);
    } else if (!inlineHelpComponent) {
      this.#dynamicComponentService.removeComponent(
        this.#inlineHelpComponentRef
      );
    }
  }

  #updateSort(): void {
    this.sortOrder$.next(this.params?.column.getSort() || undefined);
  }

  #updateSortIndex(): void {
    const sortIndex = this.params?.column.getSortIndex();
    const otherSortColumns = this.params?.columnApi
      ?.getColumns()
      ?.some(
        (column) =>
          column.getColId() !== this.params?.column.getColId() &&
          !!column.getSort()
      );
    if (sortIndex !== undefined && sortIndex !== null && otherSortColumns) {
      this.sortIndexDisplay$.next(`${sortIndex + 1}`);
    } else {
      this.sortIndexDisplay$.next('');
    }
  }
}
