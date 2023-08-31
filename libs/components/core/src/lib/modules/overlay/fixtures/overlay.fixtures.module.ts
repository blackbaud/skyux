import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { OverlayFixtureComponent } from './overlay.component.fixture';

@NgModule({
  imports: [CommonModule, RouterTestingModule],
  declarations: [OverlayFixtureComponent],
  exports: [OverlayFixtureComponent],
})
export class OverlayFixturesModule {}
