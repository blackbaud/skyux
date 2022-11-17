import { NgModule } from '@angular/core';

import { FontLoadingService } from '../font-loading.service';

import { FontLoadingTestingService } from './font-loading-testing.service';

@NgModule({
  providers: [
    {
      provide: FontLoadingService,
      useClass: FontLoadingTestingService,
    },
  ],
})
export class FontLoadingTestingModule {}
