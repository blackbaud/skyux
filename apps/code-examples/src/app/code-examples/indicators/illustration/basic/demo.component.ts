import { Component } from '@angular/core';
import {
  SkyIllustrationModule,
  SkyIllustrationResolverService,
} from '@skyux/indicators';

import { IllustrationDemoResolverService } from './illustration-demo-resolver.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyIllustrationModule],
  // This service is provided here as an example; your implementation of `SkyIllustrationResolverService`
  // should be provided at the application level.
  providers: [
    {
      provide: SkyIllustrationResolverService,
      useClass: IllustrationDemoResolverService,
    },
  ],
})
export class DemoComponent {}
