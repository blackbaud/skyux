import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyWaitService } from '@skyux/indicators';
import {
  SkyAutocompleteSearchAsyncArgs,
  SkyLookupAddClickEventArgs,
  SkyLookupModule,
  SkyLookupShowMoreConfig,
  SkyLookupShowMoreCustomPickerContext,
} from '@skyux/lookup';
import { SkyModalService } from '@skyux/modals';

import { map } from 'rxjs/operators';

import { DemoService } from './example.service';
import { Person } from './person';
import { PickerModalComponent } from './picker-modal.component';

/**
 * @title Lookup with a custom picker
 */
@Component({
  selector: 'app-lookup-custom-picker-example',
  templateUrl: './example.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
})
export class LookupCustomPickerExampleComponent implements OnInit {
  public favoritesForm: FormGroup<{
    favoriteNames: FormControl<Person[] | null>;
  }>;

  protected showMoreConfig: SkyLookupShowMoreConfig;

  readonly #modalSvc = inject(SkyModalService);
  readonly #svc = inject(DemoService);
  readonly #waitSvc = inject(SkyWaitService);

  constructor() {
    const names = new FormControl<Person[]>([
      {
        name: 'Shirley',
        formal: 'Ms. Bennett',
      },
    ]);

    this.favoritesForm = inject(FormBuilder).group({
      favoriteNames: names,
    });

    this.showMoreConfig = {
      customPicker: {
        open: (context): void => {
          const instance = this.#modalSvc.open(PickerModalComponent, {
            providers: [
              {
                provide: SkyLookupShowMoreCustomPickerContext,
                useValue: context,
              },
            ],
            size: 'large',
          });

          instance.closed.subscribe((closeArgs) => {
            if (closeArgs.reason === 'save') {
              this.favoritesForm.controls.favoriteNames.setValue(
                closeArgs.data as Person[],
              );
            }
          });
        },
      },
    };
  }

  public ngOnInit(): void {
    // If you need to execute some logic after the lookup values change,
    // subscribe to Angular's built-in value changes observable.
    this.favoritesForm.valueChanges.subscribe((changes) => {
      console.log('Lookup value changes:', changes);
    });
  }

  protected searchAsync(args: SkyAutocompleteSearchAsyncArgs): void {
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

  protected addClick(args: SkyLookupAddClickEventArgs): void {
    const person: Person = {
      name: 'Newman',
      formal: 'Mr. Parker',
    };

    this.#waitSvc.blockingWrap(this.#svc.addPerson(person)).subscribe(() => {
      args.itemAdded({
        item: person,
      });
    });
  }

  protected onSubmit(): void {
    alert('Form submitted with: ' + JSON.stringify(this.favoritesForm.value));
  }
}
