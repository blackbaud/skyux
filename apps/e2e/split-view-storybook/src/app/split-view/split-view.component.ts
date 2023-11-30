import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { FontLoadingService } from '@skyux/storybook';

import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-split-view',
  templateUrl: './split-view.component.html',
  styleUrls: ['./split-view.component.scss'],
})
export class SplitViewDockFillComponent implements AfterViewInit, OnDestroy {
  public readonly ready = new BehaviorSubject(false);

  #fontLoadingService = inject(FontLoadingService);
  #subscriptions = new Subscription();

  public ngAfterViewInit(): void {
    this.#subscriptions.add(
      this.#fontLoadingService.ready().subscribe(() => {
        this.ready.next(true);
      })
    );
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }
}
