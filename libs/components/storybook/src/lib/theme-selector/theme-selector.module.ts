import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SkyE2eThemeSelectorComponent } from './theme-selector.component';

@NgModule({
  declarations: [SkyE2eThemeSelectorComponent],
  exports: [SkyE2eThemeSelectorComponent],
  imports: [FormsModule],
})
export class SkyE2eThemeSelectorModule {}
