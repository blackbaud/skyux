import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyToolbarModule } from '../toolbar.module';

import { SkyToolbarSectionedTestComponent } from './toolbar-sectioned.component.fixture';
import { SkyToolbarTestComponent } from './toolbar.component.fixture';

@NgModule({
  imports: [CommonModule, SkyToolbarModule],
  declarations: [SkyToolbarSectionedTestComponent, SkyToolbarTestComponent],
})
export class SkyToolbarFixturesModule {}
