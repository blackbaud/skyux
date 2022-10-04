import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoxDemoComponent } from '../code-examples/layout/box/basic/box-demo.component';
import { BoxDemoModule } from '../code-examples/layout/box/basic/box-demo.module';
import { BoxDemoComponent as InlineHelpBoxDemoComponent } from '../code-examples/layout/box/inline-help/box-demo.component';
import { BoxDemoModule as InlineHelpBoxDemoModule } from '../code-examples/layout/box/inline-help/box-demo.module';
import { DescriptionListDemoComponent } from '../code-examples/layout/description-list/horizontal/description-list-demo.component';
import { DescriptionListDemoModule } from '../code-examples/layout/description-list/horizontal/description-list-demo.module';
import { FormatDemoComponent } from '../code-examples/layout/format/format-demo.component';
import { FormatDemoModule } from '../code-examples/layout/format/format-demo.module';
import { TextExpandRepeaterDemoComponent } from '../code-examples/layout/text-expand-repeater/text-expand-repeater-demo.component';
import { TextExpandRepeaterDemoModule } from '../code-examples/layout/text-expand-repeater/text-expand-repeater-demo.module';
import { TextExpandDemoComponent } from '../code-examples/layout/text-expand/inline/text-expand-demo.component';
import { TextExpandDemoModule } from '../code-examples/layout/text-expand/inline/text-expand-demo.module';

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
  {
    path: 'format',
    component: FormatDemoComponent,
  },
  {
    path: 'text-expand-repeater',
    component: TextExpandRepeaterDemoComponent,
  },
  {
    path: 'text-expand',
    component: TextExpandDemoComponent,
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
    FormatDemoModule,
    LayoutRoutingModule,
    TextExpandRepeaterDemoModule,
    TextExpandDemoModule,
  ],
})
export class LayoutModule {}
