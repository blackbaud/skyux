import { NgModule } from '@angular/core';
import { SkyTrimModule } from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyThemeModule } from '@skyux/theme';

import { SkyBoxContentComponent } from './box-content.component';
import { SkyBoxControlsComponent } from './box-controls.component';
import { SkyBoxComponent } from './box.component';

@NgModule({
  declarations: [
    SkyBoxComponent,
    SkyBoxContentComponent,
    SkyBoxControlsComponent,
  ],
  imports: [SkyHelpInlineModule, SkyThemeModule, SkyTrimModule],
  exports: [SkyBoxComponent, SkyBoxContentComponent, SkyBoxControlsComponent],
})
export class SkyBoxModule {}
