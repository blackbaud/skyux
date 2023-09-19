import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'email/control-validator',
    loadComponent: () =>
      import(
        '../code-examples/validation/email-validation/control-validator/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'email/directive',
    loadComponent: () =>
      import(
        '../code-examples/validation/email-validation/directive/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'url/control-validator',
    loadComponent: () =>
      import(
        '../code-examples/validation/url-validation/control-validator/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'url/directive',
    loadComponent: () =>
      import(
        '../code-examples/validation/url-validation/directive/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ValidationModule {}
