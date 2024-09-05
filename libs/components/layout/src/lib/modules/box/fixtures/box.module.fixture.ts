import { NgModule } from '@angular/core';
import { SkyDropdownModule } from '@skyux/popovers';

import { SkyBoxModule } from '../box.module';

import { BoxTestComponent } from './box.component.fixture';

@NgModule({
  declarations: [BoxTestComponent],
  imports: [SkyBoxModule, SkyDropdownModule],
})
export class SkyBoxFixturesModule {}
