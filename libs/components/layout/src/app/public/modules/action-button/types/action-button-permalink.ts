import {
  NavigationExtras
} from '@angular/router';

export interface SkyActionButtonPermalink {
  route?: {
    commands: any[],
    extras: NavigationExtras
  };
  url?: string;
}
