import { NgModule } from '@angular/core';

import { SkyFileDropComponent } from './file-drop.component';
import { SkyFileItemComponent } from './file-item.component';

@NgModule({
  exports: [SkyFileDropComponent, SkyFileItemComponent],
  imports: [SkyFileDropComponent, SkyFileItemComponent],
})
export class SkyFileDropModule {}
