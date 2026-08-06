import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  RendererFactory2,
  computed,
  effect,
  inject,
  model,
  signal,
} from '@angular/core';
import { SkyCheckboxChange, SkyCheckboxModule } from '@skyux/forms';

import { IHeaderAngularComp } from 'ag-grid-angular';
import {
  GridApi,
  IHeaderParams,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { Subscription } from 'rxjs';

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
  protected readonly params = signal<IHeaderParams | undefined>(undefined, {
    // Treat every `agInit()` call as a change (even if the params reference
    // is reused) so the grid-event listener effects below always tear down
    // and reattach rather than being skipped due to signal equality.
    equal: () => false,
  });
  protected readonly label = computed(() => {
    const params = this.params();
    return params?.displayName || params?.column.getColDef().field;
  });

  #api: GridApi<unknown> | undefined;
  #subscriptions = new Subscription();
  readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.#subscriptions.unsubscribe());

    // Selection changes, for multi-select grids.
    effect((onCleanup) => {
      const api = this.params()?.api;
      if (!api || !this.multiSelect()) {
        return;
      }
      const handler = (change: SelectionChangedEvent): void => {
        if (api.isDestroyed()) {
          return;
        }
        if (change.source.match(/selectall/i)) {
          // Either select all or clear selection.
          this.indeterminate.set(false);
          this.checked.set(!!change.selectedNodes?.length);
        } else {
          this.indeterminate.set(!!change.selectedNodes?.length);
          this.checked.set(false);
        }
      };
      api.addEventListener('selectionChanged', handler);
      onCleanup(() => api.removeEventListener('selectionChanged', handler));
    });

    // Clear selection state when row data is replaced, for multi-select grids.
    effect((onCleanup) => {
      const api = this.params()?.api;
      if (!api || !this.multiSelect()) {
        return;
      }
      const handler = (): void => {
        if (api.isDestroyed()) {
          return;
        }
        this.indeterminate.set(!!api.getSelectedNodes().length);
        this.checked.set(false);
      };
      api.addEventListener('rowDataUpdated', handler);
      onCleanup(() => api.removeEventListener('rowDataUpdated', handler));
    });
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
