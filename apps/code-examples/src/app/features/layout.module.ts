import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoxDemoComponent } from '../code-examples/layout/box/basic/box-demo.component';
import { BoxDemoModule } from '../code-examples/layout/box/basic/box-demo.module';
import { BoxDemoComponent as InlineHelpBoxDemoComponent } from '../code-examples/layout/box/inline-help/box-demo.component';
import { BoxDemoModule as InlineHelpBoxDemoModule } from '../code-examples/layout/box/inline-help/box-demo.module';
import { DescriptionListDemoComponent } from '../code-examples/layout/description-list/horizontal/description-list-demo.component';
import { DescriptionListDemoModule } from '../code-examples/layout/description-list/horizontal/description-list-demo.module';

const routes: Routes = [
  {
    path: 'box/basic',
    component: BoxDemoComponent,
  },
  {
    path: 'box/inline-help',
    component: InlineHelpBoxDemoComponent,
  },
  {
    path: 'description-list',
    component: DescriptionListDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}

@NgModule({
  imports: [
    BoxDemoModule,
    InlineHelpBoxDemoModule,
    DescriptionListDemoModule,
    LayoutRoutingModule,
  ],
})
export class LayoutModule {}
