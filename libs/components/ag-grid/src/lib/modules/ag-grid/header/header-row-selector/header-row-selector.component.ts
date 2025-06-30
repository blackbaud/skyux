import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyCheckboxChange, SkyCheckboxModule } from '@skyux/forms';

import { IHeaderAngularComp } from 'ag-grid-angular';
import {
  GridApi,
  IHeaderParams,
  RowDataUpdatedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { asyncScheduler, fromEvent, observeOn } from 'rxjs';

@Component({
  selector: 'sky-ag-grid-row-selector-header',
  imports: [SkyCheckboxModule],
  templateUrl: './header-row-selector.component.html',
  styleUrl: './header-row-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.title]': 'label()',
    '[attr.role]': '"note"',
  },
})
export class SkyAgGridHeaderRowSelectorComponent implements IHeaderAngularComp {
  protected readonly checked = model(false);
  protected readonly indeterminate = signal(false);
  protected readonly multiSelect = signal(false);
  protected readonly params = signal<IHeaderParams | undefined>(undefined);
  protected readonly label = computed(() => {
    const params = this.params();
    return params?.displayName || params?.column.getColDef().field;
  });

  #api: GridApi<unknown> | undefined;
  readonly #destroyRef = inject(DestroyRef);

  public agInit(params: IHeaderParams): void {
    this.params.set(params);
    this.#api = params.api;

    // Row selection behavior can only be set when the grid is created.
    // It only changes if the grid is recreated.
    const rowSelection = params.api.getGridOption('rowSelection');
    this.multiSelect.set(
      rowSelection === 'multiple' ||
        (typeof rowSelection === 'object' && rowSelection?.mode === 'multiRow'),
    );

    if (this.multiSelect()) {
      fromEvent<SelectionChangedEvent>(params.api, 'selectionChanged')
        .pipe(takeUntilDestroyed(this.#destroyRef), observeOn(asyncScheduler))
        .subscribe((change): void => {
          if (change.source.match(/selectall/i)) {
            // Either select all or clear selection.
            this.indeterminate.set(false);
            this.checked.set(!!change.selectedNodes?.length);
          } else {
            this.indeterminate.set(!!change.selectedNodes?.length);
            this.checked.set(false);
          }
        });

      fromEvent<RowDataUpdatedEvent>(params.api, 'rowDataUpdated')
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((): void => {
          this.indeterminate.set(!!this.#api?.getSelectedNodes().length);
          this.checked.set(false);
        });
    }
  }

  public refresh(): boolean {
    return false;
  }

  protected toggleCheckbox($event: SkyCheckboxChange): void {
    if ($event.checked) {
      this.#api?.selectAll();
    } else {
      this.#api?.deselectAll();
    }
  }
}
