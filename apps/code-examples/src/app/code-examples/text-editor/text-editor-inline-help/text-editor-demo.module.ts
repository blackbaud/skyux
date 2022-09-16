import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyTextEditorModule } from '@skyux/text-editor';

import { TextEditorDemoComponent } from './text-editor-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyIdModule,
    SkyTextEditorModule,
    SkyHelpInlineModule,
  ],
  declarations: [TextEditorDemoComponent],
  exports: [TextEditorDemoComponent],
})
export class TextEditorDemoModule {}
