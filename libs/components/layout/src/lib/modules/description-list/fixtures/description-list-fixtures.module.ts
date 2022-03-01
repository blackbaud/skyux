import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyThemeService } from '@skyux/theme';

import { SkyDescriptionListModule } from '../description-list.module';

import { SkyDescriptionListTestComponent } from './description-list.component.fixture';

@NgModule({
  declarations: [SkyDescriptionListTestComponent],
  imports: [CommonModule, SkyDescriptionListModule],
  exports: [SkyDescriptionListTestComponent],
  providers: [SkyThemeService],
})
export class SkyDescriptionListFixturesModule {}
