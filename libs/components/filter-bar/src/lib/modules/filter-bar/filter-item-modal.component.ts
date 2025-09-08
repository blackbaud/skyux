import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  TemplateRef,
  Type,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { toObservable } from '@angular/core/rxjs-interop';
import { SkyIconModule } from '@skyux/icon';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { SkyFilterBarService } from './filter-bar.service';
import { SKY_FILTER_ITEM } from './filter-item.token';
import { SkyFilterBarFilterModalContext } from './models/filter-bar-filter-modal-context';
import { SkyFilterBarFilterModalOpenedArgs } from './models/filter-bar-filter-modal-opened-args';
import { SkyFilterBarFilterModalSizeType } from './models/filter-bar-filter-modal-size';
import { SkyFilterItem } from './models/filter-item';

/**
 * A filter bar item that opens a modal for complex filter configuration.
 * Use this component when your filter requires a rich UI with multiple inputs,
 * date pickers, or other complex controls that don't fit in an inline filter.
 */
@Component({
  selector: 'sky-filter-item-modal',
  imports: [CommonModule, SkyIconModule],
  templateUrl: './filter-item-modal.component.html',
  styleUrls: ['./filter-item-modal.component.scss'],
  providers: [
    { provide: SKY_FILTER_ITEM, useExisting: SkyFilterItemModalComponent },
  ],
})
export class SkyFilterItemModalComponent implements SkyFilterItem {
  /**
   * A unique identifier for the filter item.
   * @required
   */
  public readonly filterId = input.required<string>();

  /**
   * The label text for the filter item.
   * @required
   */
  public readonly labelText = input.required<string>();

  /**
   * The modal component to display when the user selects the filter.
   * The component needs to inject a `SkyFilterBarFilterModalContext` object on instantiation to receive context from the modal service.
   * The return value of the modal save action needs to be a `SkyFilterBarFilterValue`.
   * @required
   */
  public readonly modalComponent = input.required<Type<unknown>>();

  /**
   * The size of the modal to display. The valid options are `'small'`, `'medium'`, `'large'`, and `'fullScreen'`.
   * @default 'medium'
   */
  public readonly modalSize = input<SkyFilterBarFilterModalSizeType>();

  /**
   * Fires when the user clicks on the filter item. Consumers passing additional context data to a filter modal
   * must subscribe to this and return the context via the observable property on the event args.
   */
  @Output()
  public modalOpened = new EventEmitter<SkyFilterBarFilterModalOpenedArgs>();

  public readonly templateRef = viewChild(TemplateRef<unknown>);

  readonly #modalSvc = inject(SkyModalService);
  readonly #filterBarSvc = inject(SkyFilterBarService);

  public readonly filterValue = toSignal(
    toObservable(this.filterId).pipe(
      switchMap((filterId) =>
        this.#filterBarSvc.getFilterValueUpdates(filterId),
      ),
    ),
  );

  protected openFilter(): void {
    const modalComponent = this.modalComponent();
    const modalSize = this.modalSize();
    const labelText = this.labelText();
    const filterValue = this.filterValue();

    this.#openFilterCallback().subscribe((additionalContext) => {
      const context = new SkyFilterBarFilterModalContext({
        filterLabelText: labelText,
        filterValue,
        additionalContext,
      });

      const modalConfig: SkyModalConfigurationInterface = {
        providers: [
          {
            provide: SkyFilterBarFilterModalContext,
            useValue: context,
          },
        ],
      };
      if (modalSize === 'fullScreen') {
        modalConfig.fullPage = true;
      } else {
        modalConfig.size = modalSize;
      }

      const instance = this.#modalSvc.open(modalComponent, modalConfig);

      instance.closed.subscribe((args) => {
        if (args.reason === 'save') {
          this.#filterBarSvc.updateFilter({
            filterId: this.filterId(),
            filterValue: args.data,
          });
        }
      });
    });
  }

  #openFilterCallback(): Observable<Record<string, unknown> | undefined> {
    if (this.modalOpened.observed) {
      const args: SkyFilterBarFilterModalOpenedArgs = {};
      this.modalOpened.emit(args);
      return args.data?.pipe(take(1)) || of(undefined);
    }

    return of(undefined);
  }
}
