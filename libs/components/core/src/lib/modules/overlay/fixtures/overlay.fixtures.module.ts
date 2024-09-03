import { NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { OverlayFixtureComponent } from './overlay.component.fixture';

@NgModule({
  imports: [RouterTestingModule],
  declarations: [OverlayFixtureComponent],
  exports: [OverlayFixtureComponent],
})
export class OverlayFixturesModule {}
