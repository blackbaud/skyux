import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { SkyFormErrorModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyWaitService } from '@skyux/indicators';
import {
  SkyAutocompleteSearchAsyncArgs,
  SkyLookupAddClickEventArgs,
  SkyLookupModule,
  SkyLookupShowMoreConfig,
} from '@skyux/lookup';

import { map } from 'rxjs/operators';

import { DemoService } from './demo.service';
import { Person } from './person';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyFormErrorModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
})
export class DemoComponent implements OnInit {
  public favoritesForm: FormGroup<{
    favoriteName: FormControl<Person[] | null>;
  }>;

  public showMoreConfig: SkyLookupShowMoreConfig = {
    nativePickerConfig: {
      selectionDescriptor: 'names',
    },
  };

  readonly #svc = inject(DemoService);
  readonly #waitSvc = inject(SkyWaitService);

  constructor() {
    const name = new FormControl<Person[]>([{ name: 'Shirley' }], {
      validators: [
        (control: AbstractControl<Person[] | null>): ValidationErrors => {
          if (
            control.value?.some((person: Person) => !person.name.match(/e/i))
          ) {
            return { letterE: true };
          }

          return {};
        },
      ],
    });

    this.favoritesForm = inject(FormBuilder).group({
      favoriteName: name,
    });
  }

  public ngOnInit(): void {
    // If you need to execute some logic after the lookup values change,
    // subscribe to Angular's built-in value changes observable.
    this.favoritesForm.valueChanges.subscribe((changes) => {
      console.log('Lookup value changes:', changes);
    });
  }

  protected onSubmit(): void {
    alert('Form submitted with: ' + JSON.stringify(this.favoritesForm.value));
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
    };

    this.#waitSvc.blockingWrap(this.#svc.addPerson(person)).subscribe(() => {
      args.itemAdded({
        item: person,
      });
    });
  }
}
