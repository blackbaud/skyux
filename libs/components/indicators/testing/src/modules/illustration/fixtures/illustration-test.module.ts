import { NgModule } from '@angular/core';
import { SkyIllustrationResolverService } from '@skyux/indicators';

import { SkyIllustrationTestResolverService } from './illustration-test-resolver.service';
import { SkyIllustrationTestComponent } from './illustration-test.component';

@NgModule({
  imports: [SkyIllustrationTestComponent],
  providers: [
    {
      provide: SkyIllustrationResolverService,
      useClass: SkyIllustrationTestResolverService,
    },
  ],
})
export class SkyIllustrationTestModule {}
