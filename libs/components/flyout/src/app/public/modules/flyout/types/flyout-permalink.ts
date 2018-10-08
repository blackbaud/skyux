import {
  NavigationExtras
} from '@angular/router';

export interface SkyFlyoutPermalink {
  label?: string;
  route?: {
    commands: any[],
    extras?: NavigationExtras;
  };
  url?: string;
}
