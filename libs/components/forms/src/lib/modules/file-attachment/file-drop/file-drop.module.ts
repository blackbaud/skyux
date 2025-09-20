import { NgModule } from '@angular/core';

import { SkyFormErrorModule } from '../../form-error/form-error.module';

import { SkyFileDropComponent } from './file-drop.component';
import { SkyFileItemComponent } from './file-item.component';

@NgModule({
  exports: [SkyFileDropComponent, SkyFileItemComponent, SkyFormErrorModule],
  imports: [SkyFileDropComponent, SkyFileItemComponent],
})
export class SkyFileDropModule {}
