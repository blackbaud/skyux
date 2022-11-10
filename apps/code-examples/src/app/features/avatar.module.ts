import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AvatarDemoComponent } from '../code-examples/avatar/avatar/avatar-demo.component';
import { AvatarDemoModule } from '../code-examples/avatar/avatar/avatar-demo.module';

const routes: Routes = [
  {
    path: 'basic',
    component: AvatarDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvatarRoutingModule {}

@NgModule({
  imports: [AvatarRoutingModule, AvatarDemoModule],
})
export class AvatarFeatureModule {}
