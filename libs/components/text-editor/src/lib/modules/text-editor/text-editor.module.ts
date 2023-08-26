import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyToolbarModule } from '@skyux/layout';

import { SkyTextEditorMenubarComponent } from './menubar/text-editor-menubar.component';
import { SkyTextEditorComponent } from './text-editor.component';
import { SkyTextEditorToolbarComponent } from './toolbar/text-editor-toolbar.component';

@NgModule({
  imports: [CommonModule, SkyToolbarModule],
  exports: [
    SkyTextEditorComponent,
    SkyTextEditorToolbarComponent,
    SkyTextEditorMenubarComponent,
  ],
  declarations: [
    SkyTextEditorComponent,
    SkyTextEditorToolbarComponent,
    SkyTextEditorMenubarComponent,
  ],
})
export class SkyTextEditorModule {}
