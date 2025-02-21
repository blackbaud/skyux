import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { FontLoadingService } from '@skyux/storybook';

import {
  BehaviorSubject,
  Observable,
  combineLatest,
  filter,
  first,
  map,
} from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  standalone: false,
})
export class FilterComponent implements AfterViewInit, OnDestroy {
  public readonly ready: Observable<boolean>;
  readonly #fontLoadingService = inject(FontLoadingService);

  public filtersActive = false;

  public appliedFilters = [
    {
      label: 'hide orange',
      dismissible: false,
    },
    {
      label: 'berry fruit type',
      dismissible: true,
    },
  ];

  public lotsOfFilters = [
    {
      label: 'Really long filter 1',
      dismissible: false,
    },
    {
      label: 'Really long filter 2',
      dismissible: true,
    },
    {
      label: 'Really long filter 3',
      dismissible: true,
    },
    {
      label: 'Really long filter 4',
      dismissible: true,
    },
    {
      label: 'Really long filter 5',
      dismissible: true,
    },
    {
      label: 'Really long filter 6',
      dismissible: true,
    },
    {
      label: 'Really long filter 7',
      dismissible: true,
    },
    {
      label: 'Really long filter 8',
      dismissible: true,
    },
    {
      label: 'Really long filter 9',
      dismissible: true,
    },
  ];

  readonly #filterReady = new BehaviorSubject<boolean>(false);

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.#filterReady.next(true);
    }, 300);
  }

  public ngOnDestroy(): void {
    this.#filterReady.complete();
  }

  constructor() {
    this.ready = combineLatest([
      this.#filterReady,
      this.#fontLoadingService.ready(true),
    ]).pipe(
      filter(([filterReady, fontsLoaded]) => filterReady && fontsLoaded),
      first(),
      map(() => true),
    );
  }
}
