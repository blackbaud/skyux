import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyBoxModule } from '../box.module';

import { BoxTestComponent } from './box.component.fixture';

@NgModule({
  declarations: [BoxTestComponent],
  imports: [CommonModule, SkyBoxModule],
})
export class SkyBoxFixturesModule {}
