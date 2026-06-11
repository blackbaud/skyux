import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GREETING_CONFIG } from './greeting/greeting-token';
import { GreetingService } from './greeting/greeting.service';
import { LazyLoadedTestComponent } from './lazy-loaded-test.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: LazyLoadedTestComponent }]),
  ],
})
class LazyLoadedRoutingModule {}

@NgModule({
  imports: [LazyLoadedRoutingModule],
  declarations: [LazyLoadedTestComponent],
  providers: [
    GreetingService,
    {
      provide: GREETING_CONFIG,
      useValue: { greeting: 'I am lazy.' },
    },
  ],
})
export class LazyLoadedTestModule {}
