import { NgModule } from '@angular/core';

import { SkyLabelModule } from '../label.module';

import { LabelTestComponent } from './label.component.fixture';

@NgModule({
  declarations: [LabelTestComponent],
  imports: [SkyLabelModule],
  exports: [LabelTestComponent],
})
export class SkyLabelFixturesModule {}
