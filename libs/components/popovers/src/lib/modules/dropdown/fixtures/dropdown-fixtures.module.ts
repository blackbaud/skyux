import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyDropdownModule } from '../dropdown.module';

import { DropdownFixtureComponent } from './dropdown.component.fixture';

@NgModule({
  declarations: [DropdownFixtureComponent],
  imports: [CommonModule, SkyDropdownModule],
  exports: [DropdownFixtureComponent],
})
export class SkyDropdownFixturesModule {}
