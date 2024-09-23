import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { FontLoadingService } from '@skyux/storybook/font-loading';

import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  public readonly ready = new BehaviorSubject(false);

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
