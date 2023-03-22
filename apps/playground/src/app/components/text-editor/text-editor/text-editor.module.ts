import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyModalModule } from '@skyux/modals';
import { SkyTabsModule } from '@skyux/tabs';
import { SkyTextEditorModule } from '@skyux/text-editor';

import { TextEditorRoutingModule } from './text-editor-routing.module';
import { TextEditorComponent } from './text-editor.component';

@NgModule({
  declarations: [TextEditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextEditorRoutingModule,
    SkyTextEditorModule,
    SkyModalModule,
    SkyTabsModule,
  ],
})
export class TextEditorModule {
  public static routes = TextEditorRoutingModule.routes;
}
