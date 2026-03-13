import { NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { SkyTextExpandModule } from '../text-expand.module';

import { TextExpandTestComponent } from './text-expand.component.fixture';

@NgModule({
  imports: [RouterTestingModule, SkyTextExpandModule],
  exports: [TextExpandTestComponent],
  declarations: [TextExpandTestComponent],
  providers: [provideNoopSkyAnimations()],
})
export class TextExpandFixturesModule {}
