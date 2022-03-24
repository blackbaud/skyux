import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';

import { SkyThemeSelectorComponent } from './theme-selector.component';

@NgModule({
  declarations: [SkyThemeSelectorComponent],
  exports: [SkyThemeSelectorComponent],
  imports: [FormsModule, SkyIdModule, SkyInputBoxModule],
})
export class SkyThemeSelectorModule {}
