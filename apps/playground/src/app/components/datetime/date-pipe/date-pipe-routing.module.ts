import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DatePipeComponent } from './basic/date-pipe.component';
import { DatePipeProviderComponent } from './provider/date-pipe-provider.component';

const routes = [
  {
    path: '',
    component: DatePipeComponent,
    data: {
      name: 'Date pipe (basic)',
      icon: 'calendar',
      library: 'datetime',
    },
  },
  {
    path: 'provider',
    component: DatePipeProviderComponent,
    data: {
      name: 'Date pipe (locale provider)',
      icon: 'calendar',
      library: 'datetime',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class DatePipeRoutingModule {
  public static routes = routes;
}
