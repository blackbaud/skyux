import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import {
  SkyAutocompleteModule,
  SkyAutocompleteSearchAsyncArgs,
} from '@skyux/lookup';

import { map } from 'rxjs';

import { ColorOption } from './color-option';
import { LookupAutocompleteAnyValueExampleService } from './example.service';

/**
 * @title Autocomplete with any value allowed
 */
@Component({
  selector: 'app-lookup-autocomplete-basic-example',
  templateUrl: './example.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyAutocompleteModule,
    SkyInputBoxModule,
  ],
})
export class LookupAutocompleteAnyValueExampleComponent {
  readonly #svc = inject(LookupAutocompleteAnyValueExampleService);

  protected readonly favoriteColor = new FormControl<ColorOption | undefined>(
    undefined,
  );

  public readonly formGroup = inject(FormBuilder).group({
    favoriteColor: this.favoriteColor,
  });

  protected onSearchAsync(args: SkyAutocompleteSearchAsyncArgs): void {
    // In a real-world application the search service might return an Observable
    // created by calling HttpClient.get(). Assigning that Observable to the result
    // allows the autocomplete component to cancel the web request if it does not
    // // complete before the user searches again.
    args.result = this.#svc.search(args.searchText).pipe(
      map((result) => ({
        hasMore: result.hasMore,
        items: result.colors,
        totalCount: result.totalCount,
      })),
    );
  }
}
