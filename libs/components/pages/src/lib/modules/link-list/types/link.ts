import { NavigationExtras } from '@angular/router';

export interface SkyLink {
  label: string;
  permalink?: {
    route?: {
      commands: any[];
      extras?: NavigationExtras;
    };
    url?: string;
  };
}
