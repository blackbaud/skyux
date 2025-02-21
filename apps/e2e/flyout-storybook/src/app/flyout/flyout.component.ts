import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  inject,
} from '@angular/core';
import {
  SkyFlyoutAction,
  SkyFlyoutInstance,
  SkyFlyoutPermalink,
  SkyFlyoutService,
} from '@skyux/flyout';
import { FontLoadingService } from '@skyux/storybook/font-loading';

import { BehaviorSubject, Subscription } from 'rxjs';

import { FlyoutResponsiveComponent } from './flyout-responsive.component';
import { FlyoutStandardComponent } from './flyout-standard.component';

@Component({
  selector: 'app-flyout',
  templateUrl: './flyout.component.html',
  styleUrls: ['./flyout.component.scss'],
  standalone: false,
})
export class FlyoutComponent implements AfterViewInit, OnDestroy {
  public flyout: SkyFlyoutInstance<any> | undefined;

  @Input()
  public responsive: 'xs' | 'sm' | 'md' | 'lg' | undefined;

  @Input()
  public showHeaderButtons = false;

  public readonly ready = new BehaviorSubject(false);

  #fontLoadingService = inject(FontLoadingService);
  #flyoutService = inject(SkyFlyoutService);
  #subscriptions = new Subscription();

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  public ngAfterViewInit() {
    this.#subscriptions.add(
      this.#fontLoadingService.ready(true).subscribe(() => {
        this.ready.next(true);
      }),
    );

    this.openFlyout();
  }

  public openFlyout(): void {
    let primaryAction: SkyFlyoutAction | undefined;
    let permalink: SkyFlyoutPermalink | undefined;

    if (this.showHeaderButtons) {
      primaryAction = {
        callback: () => {
          return;
        },
        label: 'Primary action',
      };
      permalink = {
        label: 'Permalink',
        url: 'javascript:void(0);',
      };
    }

    let width = 500;

    switch (this.responsive) {
      case 'lg':
        width = 1250;
        break;
      case 'md':
        width = 1000;
        break;
      case 'sm':
        width = 800;
        break;
      case 'xs':
      default:
        break;
    }

    this.flyout = this.#flyoutService.open(
      this.responsive ? FlyoutResponsiveComponent : FlyoutStandardComponent,
      {
        defaultWidth: width,
        primaryAction: primaryAction,
        permalink: permalink,
        showIterator: this.showHeaderButtons,
        maxWidth: 5000,
      },
    );
  }
}
