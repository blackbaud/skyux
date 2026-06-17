import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyIllustrationModule,
  SkyIllustrationResolverService,
} from '@skyux/indicators';
import { SkyPageModule } from '@skyux/pages';

import { IllustrationResolverService } from './illustration-resolver.service';

@Component({
  imports: [SkyIllustrationModule, SkyPageModule],
  providers: [
    {
      provide: SkyIllustrationResolverService,
      useClass: IllustrationResolverService,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './illustration.component.html',
})
export class IllustrationComponent {}
