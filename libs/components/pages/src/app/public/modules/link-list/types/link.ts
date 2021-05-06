import { NavigationExtras } from '@angular/router';

export type SkyLink = {
  label: string;
  permalink?: {
    route?: {
      commands: any[];
      extras?: NavigationExtras;
    };
    url?: string;
  };
};
