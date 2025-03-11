import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'rich-text-display',
    loadChildren: () =>
      import('./rich-text-display/rich-text-display.module').then(
        (m) => m.RichTextDisplayModule,
      ),
  },
  {
    path: 'text-editor',
    loadChildren: () =>
      import('./text-editor/text-editor.module').then(
        (m) => m.TextEditorModule,
      ),
  },
  {
    path: 'text-editor-series',
    loadComponent: () =>
      import('./text-editor-series/text-editor-series.component').then(
        (m) => m.TextEditorSeriesComponent,
      ),
    data: {
      name: 'Text editor looped',
      icon: 'notepad-edit',
      library: 'text-editor',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextEditorRoutingModule {}

@NgModule({
  imports: [TextEditorRoutingModule],
})
export class TextEditorModule {
  public static routes = routes;
}
