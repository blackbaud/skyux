import { Component } from '@angular/core';
import {
  SkyIllustrationModule,
  SkyIllustrationResolverService,
} from '@skyux/indicators';

import { IllustrationDemoResolverService } from './illustration-demo-resolver.service';

/**
 * @title Spot illustration with basic setup
 */
@Component({
  selector: 'app-indicators-illustration-basic-example',
  templateUrl: './example.component.html',
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
export class IndicatorsIllustrationBasicExampleComponent {}
