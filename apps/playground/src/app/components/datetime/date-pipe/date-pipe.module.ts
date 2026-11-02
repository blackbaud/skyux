import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyCodeComponent } from '@skyux/code';
import { SkyDatePipeModule, SkyDatepickerModule } from '@skyux/datetime';

import { DatePipeComponent } from './basic/date-pipe.component';
import { DatePipeRoutingModule } from './date-pipe-routing.module';
import { DatePipeProviderComponent } from './provider/date-pipe-provider.component';

@NgModule({
  declarations: [DatePipeComponent, DatePipeProviderComponent],
  imports: [
    DatePipeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCodeComponent,
    SkyDatepickerModule,
    SkyDatePipeModule,
  ],
})
export class DatePipeModule {
  public static routes = DatePipeRoutingModule.routes;
}
