import { NgModule } from '@angular/core';

import { SkyIconModule } from '../icon.module';

import { IconTestComponent } from './icon.component.fixture';

@NgModule({
  declarations: [IconTestComponent],
  imports: [SkyIconModule],
})
export class SkyIconFixturesModule {}
