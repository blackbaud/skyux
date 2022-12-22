import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyHrefResolverService } from '@skyux/router';

import { CustomSkyHrefResolverService } from './custom-sky-href-resolver.service';

/**
 * Wrapper component for the href demo, injecting a custom resolver.
 */
@Component({
  selector: 'app-custom-sky-href-resolver',
  template: ` <ng-content></ng-content> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SkyHrefResolverService,
      useClass: CustomSkyHrefResolverService,
    },
  ],
})
export class CustomSkyHrefResolverComponent {}
