import { NavigationExtras } from '@angular/router';

export type SkyActionHubNeedsAttention = {
  message?: string;
  permalink?: {
    route?: {
      commands: any[];
      extras: NavigationExtras;
    };
    url?: string;
  };
  title?: string;
};
