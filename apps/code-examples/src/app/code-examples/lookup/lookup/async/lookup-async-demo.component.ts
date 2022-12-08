import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SkyAutocompleteSearchAsyncArgs } from '@skyux/lookup';

import { map } from 'rxjs/operators';

import { LookupAsyncDemoService } from './lookup-async-demo.service';
import { LookupDemoPerson } from './lookup-demo-person';

@Component({
  selector: 'app-async-lookup-demo',
  templateUrl: './lookup-async-demo.component.html',
  styleUrls: ['./lookup-async-demo.component.scss'],
})
export class LookupAsyncDemoComponent implements OnInit {
  public favoritesForm: FormGroup<{
    favoriteNames: FormControl<LookupDemoPerson[] | null>;
  }>;

  #searchSvc: LookupAsyncDemoService;

  constructor(
    private formBuilder: FormBuilder,
    searchSvc: LookupAsyncDemoService
  ) {
    this.#searchSvc = searchSvc;

    const names = new FormControl<LookupDemoPerson[]>([{ name: 'Shirley' }]);

    this.favoritesForm = this.formBuilder.group({
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

  public onSubmit(): void {
    alert('Form submitted with: ' + JSON.stringify(this.favoritesForm.value));
  }

  public searchAsync(args: SkyAutocompleteSearchAsyncArgs): void {
    // In a real-world application the search service might return an Observable
    // created by calling HttpClient.get(). Assigning that Observable to the result
    // allows the lookup component to cancel the web request if it does not complete
    // before the user searches again.
    args.result = this.#searchSvc.search(args.searchText).pipe(
      map((result) => ({
        hasMore: result.hasMore,
        items: result.people,
        totalCount: result.totalCount,
      }))
    );
  }
}
