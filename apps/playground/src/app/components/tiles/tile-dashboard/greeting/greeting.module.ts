import { NgModule } from '@angular/core';

import { GreetingService } from './greeting.service';

@NgModule({
  providers: [
    {
      provide: GreetingService,
      useValue: new GreetingService({ greeting: 'GreetingModule' }),
    },
  ],
})
export class GreetingModule {}
