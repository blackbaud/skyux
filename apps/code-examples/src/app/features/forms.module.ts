import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'character-count',
    loadComponent: () =>
      import('../code-examples/forms/character-count/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'checkbox/basic',
    loadComponent: () =>
      import('../code-examples/forms/checkbox/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'checkbox/icon-group',
    loadComponent: () =>
      import('../code-examples/forms/checkbox/icon-group/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'field-group/basic',
    loadComponent: () =>
      import('../code-examples/forms/field-group/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'file-attachment/basic',
    loadComponent: () =>
      import(
        '../code-examples/forms/file-attachment/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'file-drop/basic',
    loadComponent: () =>
      import('../code-examples/forms/file-drop/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'input-box/basic',
    loadComponent: () =>
      import('../code-examples/forms/input-box/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'radio/icon',
    loadComponent: () =>
      import('../code-examples/forms/radio/icon/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'radio/standard',
    loadComponent: () =>
      import('../code-examples/forms/radio/standard/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'selection-box/checkbox',
    loadComponent: () =>
      import(
        '../code-examples/forms/selection-box/checkbox/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'selection-box/radio',
    loadComponent: () =>
      import('../code-examples/forms/selection-box/radio/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'toggle-switch/basic',
    loadComponent: () =>
      import('../code-examples/forms/toggle-switch/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'toggle-switch/inline-help',
    loadComponent: () =>
      import(
        '../code-examples/forms/toggle-switch/inline-help/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class FormsModule {}
