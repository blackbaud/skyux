import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyWaitService } from '@skyux/indicators';
import {
  SkyAutocompleteSearchAsyncArgs,
  SkyLookupAddClickEventArgs,
  SkyLookupModule,
  SkyLookupShowMoreConfig,
} from '@skyux/lookup';
import { SkyModalService } from '@skyux/modals';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AddItemModalComponent } from './add-item-modal.component';
import { DemoService } from './example.service';
import { Person } from './person';

/**
 * @title Lookup with add item button
 */
@Component({
  selector: 'app-lookup-add-item-example',
  templateUrl: './example.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
})
export class LookupAddItemExampleComponent implements OnInit, OnDestroy {
  public favoritesForm: FormGroup<{
    favoriteNames: FormControl<Person[] | null>;
  }>;

  public showMoreConfig: SkyLookupShowMoreConfig = {
    nativePickerConfig: {
      selectionDescriptor: 'names',
    },
  };

  #subscriptions = new Subscription();

  readonly #svc = inject(DemoService);
  readonly #modalSvc = inject(SkyModalService);
  readonly #waitSvc = inject(SkyWaitService);

  constructor() {
    const names = new FormControl<Person[]>([{ id: '16', name: 'Shirley' }]);

    this.favoritesForm = inject(FormBuilder).group({
      favoriteNames: names,
    });
  }

  public ngOnInit(): void {
    // If you need to execute some logic after the lookup values change,
    // subscribe to Angular's built-in value changes observable.
    this.favoritesForm.valueChanges.subscribe((changes) => {
      console.log('Lookup value changes:', changes);
    });
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  public onSubmit(): void {
    alert('Form submitted with: ' + JSON.stringify(this.favoritesForm.value));
  }

  public searchAsync(args: SkyAutocompleteSearchAsyncArgs): void {
    // In a real-world application the search service might return an Observable
    // created by calling HttpClient.get(). Assigning that Observable to the result
    // allows the lookup component to cancel the web request if it does not complete
    // before the user searches again.
    args.result = this.#svc.search(args.searchText).pipe(
      map((result) => ({
        hasMore: result.hasMore,
        items: result.people,
        totalCount: result.totalCount,
      })),
    );
  }

  public addClick(args: SkyLookupAddClickEventArgs): void {
    const modal = this.#modalSvc.open(AddItemModalComponent);

    this.#subscriptions.add(
      modal.closed.subscribe((close) => {
        if (close.reason === 'save') {
          const person = close.data as Person;

          this.#subscriptions.add(
            this.#waitSvc
              .blockingWrap(this.#svc.addPerson(person))
              .subscribe((data) => {
                args.itemAdded({
                  item: person,
                  data,
                });
              }),
          );
        }
      }),
    );
  }
}
