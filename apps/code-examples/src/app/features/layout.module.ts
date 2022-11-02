import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoxDemoComponent } from '../code-examples/layout/box/basic/box-demo.component';
import { BoxDemoModule } from '../code-examples/layout/box/basic/box-demo.module';
import { BoxDemoComponent as InlineHelpBoxDemoComponent } from '../code-examples/layout/box/inline-help/box-demo.component';
import { BoxDemoModule as InlineHelpBoxDemoModule } from '../code-examples/layout/box/inline-help/box-demo.module';
import { DescriptionListDemoComponent as DescriptionListHorizontalDemoComponent } from '../code-examples/layout/description-list/horizontal/description-list-demo.component';
import { DescriptionListDemoModule as DescriptionListHorizontalDemoModule } from '../code-examples/layout/description-list/horizontal/description-list-demo.module';
import { DescriptionListDemoComponent as DescriptionListInlineHelpDemoComponent } from '../code-examples/layout/description-list/inline-help/description-list-demo.component';
import { DescriptionListDemoModule as DescriptionListInlineHelpDemoModule } from '../code-examples/layout/description-list/inline-help/description-list-demo.module';
import { DescriptionListDemoComponent as DescriptionListLongDescriptionDemoComponent } from '../code-examples/layout/description-list/long-description/description-list-demo.component';
import { DescriptionListDemoModule as DescriptionListLongDescriptionDemoModule } from '../code-examples/layout/description-list/long-description/description-list-demo.module';
import { DescriptionListDemoComponent as DescriptionListVerticalDemoComponent } from '../code-examples/layout/description-list/vertical/description-list-demo.component';
import { DescriptionListDemoModule as DescriptionListVerticalDemoModule } from '../code-examples/layout/description-list/vertical/description-list-demo.module';

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
    component: DescriptionListHorizontalDemoComponent,
  },
  {
    path: 'description-list/long-description',
    component: DescriptionListLongDescriptionDemoComponent,
  },
  {
    path: 'description-list/vertical',
    component: DescriptionListVerticalDemoComponent,
  },
  {
    path: 'description-list/inline-help',
    component: DescriptionListInlineHelpDemoComponent,
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
    DescriptionListHorizontalDemoModule,
    DescriptionListLongDescriptionDemoModule,
    DescriptionListVerticalDemoModule,
    DescriptionListInlineHelpDemoModule,
    LayoutRoutingModule,
  ],
})
export class LayoutModule {}
