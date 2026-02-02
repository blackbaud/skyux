import {
  Component,
  DestroyRef,
  EnvironmentInjector,
  EventEmitter,
  Injector,
  Output,
  TemplateRef,
  Type,
  inject,
  input,
  runInInjectionContext,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { toObservable } from '@angular/core/rxjs-interop';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { Observable, Subject, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { SkyFilterBarService } from '../filter-bar.service';
import { SkyFilterItem } from '../models/filter-item';
import { SkyFilterItemModal } from '../models/filter-item-modal';
import { SkyFilterItemModalContext } from '../models/filter-item-modal-context';
import { SkyFilterItemModalInstance } from '../models/filter-item-modal-instance';
import { SkyFilterItemModalOpenedArgs } from '../models/filter-item-modal-opened-args';
import { SkyFilterItemModalSavedArgs } from '../models/filter-item-modal-saved-args';
import { SkyFilterItemModalSizeType } from '../models/filter-item-modal-size';

import { SkyFilterItemBaseComponent } from './filter-item-base.component';
import { SKY_FILTER_ITEM } from './filter-item.token';

/**
 * A filter bar item that opens a modal for complex filter configuration.
 * Use this component when your filter requires a rich UI with multiple inputs,
 * date pickers, or other complex controls that don't fit in an inline filter.
 */
@Component({
  selector: 'sky-filter-item-modal',
  imports: [SkyFilterItemBaseComponent],
  templateUrl: './filter-item-modal.component.html',
  providers: [
    { provide: SKY_FILTER_ITEM, useExisting: SkyFilterItemModalComponent },
  ],
})
export class SkyFilterItemModalComponent<
  TData = Record<string, unknown> | undefined,
  TValue = unknown,
> implements SkyFilterItem<TValue>
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
   * The modal component to display when the user selects the filter.
   * The component needs to inject a `SkyFilterItemModalInstance` object on instantiation to receive the modal instance and context from the modal service.
   * The return value of the modal save action needs to be a `SkyFilterBarFilterValue`.
   * @required
   */
  public readonly modalComponent =
    input.required<Type<SkyFilterItemModal<TData, TValue>>>();

  /**
   * The size of the modal to display. The valid options are `"small"`, `"medium"`, `"large"`, and `"fullScreen"`.
   */
  public readonly modalSize = input.required<SkyFilterItemModalSizeType>();

  /**
   * Fires when the user clicks the filter item. To pass additional context data to a filter modal, consumers
   * must subscribe to this event and return the context using the observable property on the event args.
   */
  @Output()
  public modalOpened = new EventEmitter<SkyFilterItemModalOpenedArgs<TData>>();

  public readonly templateRef = viewChild(TemplateRef<unknown>);

  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #modalSvc = inject(SkyModalService);
  readonly #filterBarSvc = inject(SkyFilterBarService);

  public readonly filterValue = toSignal(
    toObservable(this.filterId).pipe(
      switchMap((filterId) =>
        this.#filterBarSvc.getFilterValueUpdates<TValue>(filterId),
      ),
    ),
  );

  protected openFilter(): void {
    const modalComponent = this.modalComponent();
    const modalSize = this.modalSize();
    const labelText = this.labelText();
    const filterValue = this.filterValue();

    this.#openFilterCallback().subscribe((additionalContext) => {
      const context = new SkyFilterItemModalContext<TData, TValue>({
        filterLabelText: labelText,
        filterValue,
        additionalContext,
      });

      const injector = Injector.create({
        parent: this.#environmentInjector,
        providers: [{ provide: SkyFilterItemModalContext, useValue: context }],
      });

      runInInjectionContext(injector, () => {
        const destroyRef = injector.get(DestroyRef);

        const saved = new Subject<SkyFilterItemModalSavedArgs<TValue>>();
        const canceled = new Subject<void>();

        const context = inject<SkyFilterItemModalContext<TData, TValue>>(
          SkyFilterItemModalContext,
        );

        const filterModalInstance: SkyFilterItemModalInstance<TData, TValue> = {
          context,
          cancel() {
            canceled.next();
            canceled.complete();
          },
          save(result) {
            saved.next(result);
            saved.complete();
          },
        };

        canceled
          .pipe(takeUntilDestroyed(destroyRef))
          .subscribe(() => instance.cancel());
        saved
          .pipe(takeUntilDestroyed(destroyRef))
          .subscribe((result) => instance.save(result.filterValue));

        const modalConfig: SkyModalConfigurationInterface = {
          providers: [
            {
              provide: SkyFilterItemModalInstance,
              useValue: filterModalInstance,
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
    });
  }

  #openFilterCallback(): Observable<TData | undefined> {
    if (this.modalOpened.observed) {
      const args: SkyFilterItemModalOpenedArgs<TData> = {
        filterId: this.filterId(),
      };
      this.modalOpened.emit(args);
      return args.data?.pipe(take(1)) || of(undefined);
    }

    return of(undefined);
  }
}
