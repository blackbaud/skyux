import { NgModule } from '@angular/core';
import { SkyFormErrorModule } from '@skyux/forms';

import { SkyTextEditorComponent } from './text-editor.component';

@NgModule({
  imports: [SkyTextEditorComponent],
  exports: [SkyTextEditorComponent, SkyFormErrorModule],
})
export class SkyTextEditorModule {}
