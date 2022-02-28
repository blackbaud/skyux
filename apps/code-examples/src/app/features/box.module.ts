import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoxDemoComponent as BasicComponent } from '../code-examples/layout/box/basic/box-demo.component';
import { BoxDemoModule as BasicModule } from '../code-examples/layout/box/basic/box-demo.module';

const routes: Routes = [
  {
    path: 'basic',
    component: BasicComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoxRoutingModule {}

@NgModule({
  imports: [BasicModule, BoxRoutingModule],
})
export class BoxModule {}
