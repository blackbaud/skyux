import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RichTextDisplayDemoComponent as RichTextDisplayRichTextDisplayDemoComponent } from '../code-examples/text-editor/rich-text-display/rich-text-display-demo.component';
import { RichTextDisplayDemoModule as RichTextDisplayRichTextDisplayDemoModule } from '../code-examples/text-editor/rich-text-display/rich-text-display-demo.module';
import { TextEditorDemoComponent as TextEditorInlineHelpTextEditorDemoComponent } from '../code-examples/text-editor/text-editor-inline-help/text-editor-demo.component';
import { TextEditorDemoModule as TextEditorInlineHelpTextEditorDemoModule } from '../code-examples/text-editor/text-editor-inline-help/text-editor-demo.module';
import { TextEditorDemoComponent as TextEditorTextEditorDemoComponent } from '../code-examples/text-editor/text-editor/text-editor-demo.component';
import { TextEditorDemoModule as TextEditorTextEditorDemoModule } from '../code-examples/text-editor/text-editor/text-editor-demo.module';

const routes: Routes = [
  {
    path: 'rich-text-display',
    component: RichTextDisplayRichTextDisplayDemoComponent,
  },
  { path: 'text-editor', component: TextEditorTextEditorDemoComponent },
  {
    path: 'text-editor-inline-help',
    component: TextEditorInlineHelpTextEditorDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextEditorFeatureRoutingModule {}

@NgModule({
  imports: [
    RichTextDisplayRichTextDisplayDemoModule,
    TextEditorInlineHelpTextEditorDemoModule,
    TextEditorTextEditorDemoModule,
    TextEditorFeatureRoutingModule,
  ],
})
export class TextEditorFeatureModule {}
