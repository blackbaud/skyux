import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { SkyErrorType } from '@skyux/errors';
import { FontLoadingService } from '@skyux/storybook/font-loading';

import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  standalone: false,
})
export class ErrorComponent implements AfterViewInit, OnDestroy {
  public customAction = false;
  public customImage = false;
  public customTitleAndDescription = false;
  public errorType: SkyErrorType = 'broken';
  public pageError = true;
  public readonly ready = new BehaviorSubject(false);
  public replaceDefaultTitleAndDescription = false;
  public showImage = true;

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
