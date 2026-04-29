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
  SkyAutocompleteSearchAsyncArgs,
  SkyLookupModule,
  SkyLookupShowMoreConfig,
} from '@skyux/lookup';

import { map } from 'rxjs/operators';

import { DemoService } from './example.service';
import { Person } from './person';

/**
 * @title Lookup search using picker only
 */
@Component({
  selector: 'app-lookup-search-with-picker-only-example',
  templateUrl: './example.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
})
export class LookupSearchWithPickerOnlyExampleComponent {
  readonly #demoSvc = inject(DemoService);

  protected favoritesForm = inject(FormBuilder).group({
    favoriteName: new FormControl<Person[]>([]),
  });

  protected showMoreConfig: SkyLookupShowMoreConfig = {
    nativePickerConfig: {
      selectionDescriptor: 'names',
    },
    searchWithPickerOnly: true,
  };

  protected onSubmit(): void {
    alert('Form submitted with: ' + JSON.stringify(this.favoritesForm.value));
  }

  protected searchAsync(args: SkyAutocompleteSearchAsyncArgs): void {
    args.result = this.#demoSvc.search(args.searchText).pipe(
      map((result) => ({
        hasMore: result.hasMore,
        items: result.people,
        totalCount: result.totalCount,
      })),
    );
  }
}
