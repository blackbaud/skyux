import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoxDemoComponent } from './code-examples/layout/box/box-demo.component';

const routes: Routes = [{ path: 'box', component: BoxDemoComponent }];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
