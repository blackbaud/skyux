import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { SkyTextExpandModule } from '../text-expand.module';

import { TextExpandTestComponent } from './text-expand.component.fixture';

@NgModule({
  imports: [NoopAnimationsModule, RouterTestingModule, SkyTextExpandModule],
  exports: [TextExpandTestComponent],
  declarations: [TextExpandTestComponent],
})
export class TextExpandFixturesModule {}
