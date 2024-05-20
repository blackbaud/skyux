import { Component } from '@angular/core';
import {
  SkyIllustrationModule,
  SkyIllustrationResolverService,
} from '@skyux/indicators';
import { SkyPageModule } from '@skyux/pages';

import { IllustrationResolverService } from './illustration-resolver.service';

@Component({
  standalone: true,
  imports: [SkyIllustrationModule, SkyPageModule],
  providers: [
    {
      provide: SkyIllustrationResolverService,
      useClass: IllustrationResolverService,
    },
  ],
  templateUrl: './illustration.component.html',
})
export class IllustrationComponent {}
