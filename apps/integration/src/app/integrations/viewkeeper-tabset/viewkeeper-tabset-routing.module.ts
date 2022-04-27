import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ViewkeeperTabsetComponent } from './viewkeeper-tabset.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ViewkeeperTabsetComponent,
      },
    ]),
  ],
})
export class ViewkeeperTabsetRoutingModule {}
