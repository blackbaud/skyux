import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { FontLoadingService } from '@skyux/storybook/font-loading';

import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss'],
})
export class InfiniteScrollComponent implements AfterViewInit, OnDestroy {
  public enabled = true;
  public loading = false;
  public items: string[] = ['Rory', 'River', 'Amy', 'Clara'];
  public readonly ready = new BehaviorSubject(false);
  public scrollableParent = false;

  #fontLoadingService = inject(FontLoadingService);
  #subscriptions = new Subscription();

  public ngAfterViewInit(): void {
    this.#subscriptions.add(
      this.#fontLoadingService.ready().subscribe(() => {
        this.ready.next(true);
      }),
    );
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }
}
