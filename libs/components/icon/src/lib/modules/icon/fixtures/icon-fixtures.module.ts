import { NgModule } from '@angular/core';

import { SkyIconModule } from '../icon.module';

import { IconStackTestComponent } from './icon-stack.component.fixture';
import { IconTestComponent } from './icon.component.fixture';

@NgModule({
  declarations: [IconTestComponent, IconStackTestComponent],
  imports: [SkyIconModule],
})
export class SkyIconFixturesModule {}
