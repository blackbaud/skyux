import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'alert/basic',
    loadComponent: () =>
      import('../code-examples/indicators/alert/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'illustration/basic',
    loadComponent: () =>
      import(
        '../code-examples/indicators/illustration/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'key-info/basic',
    loadComponent: () =>
      import('../code-examples/indicators/key-info/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'label/basic',
    loadComponent: () =>
      import('../code-examples/indicators/label/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'status-indicator/basic',
    loadComponent: () =>
      import(
        '../code-examples/indicators/status-indicator/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'status-indicator/inline-help',
    loadComponent: () =>
      import(
        '../code-examples/indicators/status-indicator/inline-help/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'text-highlight/basic',
    loadComponent: () =>
      import(
        '../code-examples/indicators/text-highlight/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'tokens/basic',
    loadComponent: () =>
      import('../code-examples/indicators/tokens/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'tokens/custom',
    loadComponent: () =>
      import('../code-examples/indicators/tokens/custom/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'wait/element',
    loadComponent: () =>
      import('../code-examples/indicators/wait/element/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'wait/page',
    loadComponent: () =>
      import('../code-examples/indicators/wait/page/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class IndicatorsFeatureModule {}
