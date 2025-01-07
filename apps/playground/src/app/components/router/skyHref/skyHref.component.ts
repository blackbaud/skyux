import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyAlertModule } from '@skyux/indicators';
import {
  SkyHref,
  SkyHrefModule,
  SkyHrefResolverArgs,
  SkyHrefResolverService,
} from '@skyux/router';

@Component({
  selector: 'app-sky-href',
  templateUrl: './skyHref.component.html',
  styleUrls: ['./skyHref.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyAlertModule, SkyHrefModule],
  providers: [
    {
      provide: SkyHrefResolverService,
      useValue: {
        resolveHref: (args: SkyHrefResolverArgs): Promise<SkyHref> =>
          Promise.resolve<SkyHref>({
            url: args.url.replace('allow://', 'https://'),
            userHasAccess: !args.url.startsWith('deny://'),
          }),
      },
    },
  ],
})
export class SkyHrefComponent {}
