import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SkyWaitService } from '@skyux/indicators';
import {
  SkyAutocompleteSearchAsyncArgs,
  SkyLookupAddClickEventArgs,
} from '@skyux/lookup';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { LookupAsyncDemoService } from './lookup-async-demo.service';
import { LookupDemoAddItemComponent } from './lookup-demo-add-item.component';
import { LookupDemoPerson } from './lookup-demo-person';

@Component({
  selector: 'app-async-lookup-demo',
  templateUrl: './lookup-async-demo.component.html',
  styleUrls: ['./lookup-async-demo.component.scss'],
})
export class LookupAsyncDemoComponent implements OnInit, OnDestroy {
  public favoritesForm: FormGroup<{
    favoriteNames: FormControl<LookupDemoPerson[] | null>;
  }>;

  #modalService = inject(SkyModalService);
  #subscriptions = new Subscription();
  #svc = inject(LookupAsyncDemoService);
  #waitSvc = inject(SkyWaitService);

  constructor(formBuilder: FormBuilder) {
    const names = new FormControl<LookupDemoPerson[]>([
      { id: '16', name: 'Shirley' },
    ]);

    this.favoritesForm = formBuilder.group({
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
      }))
    );
  }

  public addClick(args: SkyLookupAddClickEventArgs): void {
    const modal = this.#modalService.open(LookupDemoAddItemComponent);
    this.#subscriptions.add(
      modal.closed.subscribe((close: SkyModalCloseArgs) => {
        if (close.reason === 'save') {
          this.#subscriptions.add(
            this.#waitSvc
              .blockingWrap(this.#svc.addPerson(close.data))
              .subscribe((data) => {
                args.itemAdded({
                  item: close.data,
                  data: data,
                });
              })
          );
        }
      })
    );
  }
}
