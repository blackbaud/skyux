import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'rich-text-display',
    loadComponent: () =>
      import(
        '../code-examples/text-editor/rich-text-display/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'text-editor',
    loadComponent: () =>
      import('../code-examples/text-editor/text-editor/demo.component').then(
        (c) => c.DemoComponent
      ),
  },
  {
    path: 'text-editor-inline-help',
    loadComponent: () =>
      import(
        '../code-examples/text-editor/text-editor-inline-help/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TextEditorFeatureModule {}
