import { AfterViewInit, Component, Input, inject } from '@angular/core';
import {
  SkyFlyoutAction,
  SkyFlyoutInstance,
  SkyFlyoutPermalink,
  SkyFlyoutService,
} from '@skyux/flyout';

import { FlyoutResponsiveComponent } from './flyout-responsive.component';
import { FlyoutStandardComponent } from './flyout-standard.component';

@Component({
  selector: 'app-flyout',
  templateUrl: './flyout.component.html',
  styleUrls: ['./flyout.component.scss'],
  standalone: false,
})
export class FlyoutComponent implements AfterViewInit {
  public flyout: SkyFlyoutInstance<any> | undefined;

  @Input()
  public responsive: 'xs' | 'sm' | 'md' | 'lg' | undefined;

  @Input()
  public showHeaderButtons = false;

  #flyoutService = inject(SkyFlyoutService);

  public ngAfterViewInit(): void {
    this.openFlyout();
  }

  public openFlyout(): void {
    let primaryAction: SkyFlyoutAction | undefined;
    let permalink: SkyFlyoutPermalink | undefined;

    if (this.showHeaderButtons) {
      primaryAction = {
        callback: (): void => {
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

    if (this.responsive) {
      this.flyout = this.#flyoutService.open(FlyoutResponsiveComponent, {
        defaultWidth: width,
        primaryAction: primaryAction,
        permalink: permalink,
        showIterator: this.showHeaderButtons,
        maxWidth: 5000,
      });
    } else {
      this.flyout = this.#flyoutService.open(FlyoutStandardComponent, {
        defaultWidth: width,
        primaryAction: primaryAction,
        permalink: permalink,
        showIterator: this.showHeaderButtons,
        maxWidth: 5000,
      });
    }
  }
}
