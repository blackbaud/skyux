import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SkyAutonumericModule } from '../autonumeric.module';

import { AutonumericFixtureComponent } from './autonumeric.component.fixture';

@NgModule({
  imports: [FormsModule, ReactiveFormsModule, SkyAutonumericModule],
  declarations: [AutonumericFixtureComponent],
  exports: [AutonumericFixtureComponent],
})
export class AutonumericFixtureModule {}
