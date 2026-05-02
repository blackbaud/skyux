import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  RendererFactory2,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { SkyCheckboxChange, SkyCheckboxModule } from '@skyux/forms';

import { IHeaderAngularComp } from 'ag-grid-angular';
import { GridApi, IHeaderParams } from 'ag-grid-community';
import { Subscription } from 'rxjs';

import { fromGridEvent } from '../../ag-grid-event-utils';

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
  #subscriptions = new Subscription();
  readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.#subscriptions.unsubscribe());
  }

  public agInit(params: IHeaderParams): void {
    this.params.set(params);
    this.#api = params.api;
    this.#subscriptions.unsubscribe();
    this.#subscriptions = new Subscription();

    // Row selection behavior can only be set when the grid is created.
    // It only changes if the grid is recreated.
    const rowSelection = params.api.getGridOption('rowSelection');
    this.multiSelect.set(
      rowSelection === 'multiple' ||
        (typeof rowSelection === 'object' && rowSelection?.mode === 'multiRow'),
    );

    if (this.multiSelect()) {
      this.#subscriptions.add(
        fromGridEvent(params.api, 'selectionChanged').subscribe((change) => {
          if (change.source.match(/selectall/i)) {
            // Either select all or clear selection.
            this.indeterminate.set(false);
            this.checked.set(!!change.selectedNodes?.length);
          } else {
            this.indeterminate.set(!!change.selectedNodes?.length);
            this.checked.set(false);
          }
        }),
      );

      this.#subscriptions.add(
        fromGridEvent(params.api, 'rowDataUpdated').subscribe(() => {
          this.indeterminate.set(!!this.#api?.getSelectedNodes().length);
          this.checked.set(false);
        }),
      );

      const el = params.eGridHeader;
      if (el) {
        this.#renderer.setAttribute(el, 'aria-keyshortcuts', 'Enter Space');
        this.#subscriptions.add(
          this.#renderer.listen(el, 'keydown', (evt: KeyboardEvent) => {
            if (!['Enter', ' '].includes(evt.key) || evt.repeat) {
              return;
            }
            if (evt.key === ' ') {
              evt.preventDefault();
            }
            if (this.checked()) {
              this.#api?.deselectAll();
            } else {
              this.#api?.selectAll();
            }
          }),
        );
      }
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
