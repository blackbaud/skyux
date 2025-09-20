import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

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
    {
      provide: GreetingService,
      useValue: new GreetingService({ greeting: 'I am lazy.' }),
    },
  ],
})
export class LazyLoadedTestModule {}
