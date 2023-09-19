import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'phone-field/basic',
    loadComponent: () =>
      import(
        '../code-examples/phone-field/phone-field/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PhoneModule {}
