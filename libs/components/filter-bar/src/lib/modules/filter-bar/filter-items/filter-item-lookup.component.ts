import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  TemplateRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { toObservable } from '@angular/core/rxjs-interop';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkySelectionModalService } from '@skyux/lookup';

import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { SkyFilterBarService } from '../filter-bar.service';
import { SkyFilterBarFilterValue } from '../models/filter-bar-filter-value';
import { SkyFilterItem } from '../models/filter-item';
import { SkyFilterItemLookupSearchAsyncArgs } from '../models/filter-item-lookup-search-async-args';

import { SKY_FILTER_ITEM } from './filter-item.token';

/**
 * A filter bar item that opens a selection modal for complex filter configuration.
 * Use this component for lookup-type filter fields where users select one or more
 * options from a list of values.
 */
@Component({
  selector: 'sky-filter-item-lookup',
  imports: [CommonModule, SkyIconModule],
  templateUrl: './filter-item-lookup.component.html',
  styleUrls: ['./filter-item-lookup.component.scss'],
  providers: [
    { provide: SKY_FILTER_ITEM, useExisting: SkyFilterItemLookupComponent },
  ],
})
export class SkyFilterItemLookupComponent
  implements SkyFilterItem, AfterViewInit
{
  /**
   * A unique identifier for the filter item.
   * @required
   */
  public readonly filterId = input.required<string>();

  /**
   * The label to display for the filter item.
   * @required
   */
  public readonly labelText = input.required<string>();

  /**
   * The object property to display for each filter value in the selection modal when users open the filter.
   * @required
   */
  public readonly searchDescriptorProperty = input.required<string>();

  /**
   * The object property that represents a unique identifier for each filter value in the selection modal when users open the filter.
   * @required
   */
  public readonly searchIdProperty = input.required<string>();

  /**
   * Fires when users enter search information and allows results to be
   * returned via an observable. The event also fires with empty search text
   * when the filter is opened.
   * @required
   */
  @Output()
  public searchAsync = new EventEmitter<SkyFilterItemLookupSearchAsyncArgs>();

  public readonly templateRef = viewChild(TemplateRef<unknown>);

  readonly #filterBarSvc = inject(SkyFilterBarService);
  readonly #selectionModalSvc = inject(SkySelectionModalService);
  readonly #resourceSvc = inject(SkyLibResourcesService);

  public readonly filterValue = toSignal(
    toObservable(this.filterId).pipe(
      switchMap((filterId) =>
        this.#filterBarSvc.getFilterValueUpdates(filterId),
      ),
    ),
  );

  public ngAfterViewInit(): void {
    /* istanbul ignore if: safety check */
    if (!this.searchAsync.observed) {
      throw new Error(
        'The SkyFilterItemLookupComponent requires the `searchAsync` output to have an observer.',
      );
    }
  }

  protected openFilter(): void {
    const filterId = this.filterId();
    const filterValue = this.filterValue();
    const descriptorProperty = this.searchDescriptorProperty();
    const idProperty = this.searchIdProperty();

    const instance = this.#selectionModalSvc.open({
      descriptorProperty: descriptorProperty,
      idProperty: idProperty,
      searchAsync: (args) => {
        const searchAsyncArgs: SkyFilterItemLookupSearchAsyncArgs = {
          filterId: filterId,
          offset: args.offset,
          searchText: args.searchText,
          continuationData: args.continuationData,
        };

        this.searchAsync.emit(searchAsyncArgs);

        return searchAsyncArgs.result;
      },
      selectMode: 'multiple',
      value: filterValue?.value as unknown[] | undefined,
    });

    instance.closed
      .pipe(
        switchMap((args): Observable<SkyFilterBarFilterValue | undefined> => {
          if (args.reason !== 'save') {
            return of(undefined);
          }

          const selected = args.selectedItems;
          if (!selected?.length) {
            return of({ value: undefined });
          }

          if (selected.length === 1) {
            const item = selected[0] as Record<string, unknown>;

            return of({
              value: selected,
              displayValue: item[descriptorProperty] as string,
            });
          }

          // Multiple selections: get localized "n selected" string.
          return this.#resourceSvc
            .getString('skyux_filter_item_n_selected', selected.length)
            .pipe(
              map((displayValue) => ({
                value: selected,
                displayValue,
              })),
            );
        }),
      )
      .subscribe((filter) => {
        // no filter means the modal was not saved
        if (filter) {
          let filterValue: SkyFilterBarFilterValue | undefined;
          // no filter value means the save result was empty, so emit undefined
          if (filter.value) {
            filterValue = filter;
          }
          this.#filterBarSvc.updateFilter({
            filterId: this.filterId(),
            filterValue,
          });
        }
      });
  }
}
