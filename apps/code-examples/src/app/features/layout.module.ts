import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BackToTopDemoComponent as BackToTopGridDemoComponent } from '../code-examples/layout/back-to-top/grid/back-to-top-demo.component';
import { BackToTopDemoModule as BackToTopGridDemoModule } from '../code-examples/layout/back-to-top/grid/back-to-top-demo.module';
import { BackToTopDemoComponent as BackToTopInfiniteScrollDemoComponent } from '../code-examples/layout/back-to-top/infinite-scroll/back-to-top-demo.component';
import { BackToTopDemoModule as BackToTopInfiniteScrollDemoModule } from '../code-examples/layout/back-to-top/infinite-scroll/back-to-top-demo.module';
import { BackToTopDemoComponent as BackToTopRepeaterDemoComponent } from '../code-examples/layout/back-to-top/repeater/back-to-top-demo.component';
import { BackToTopDemoModule as BackToTopRepeaterDemoModule } from '../code-examples/layout/back-to-top/repeater/back-to-top-demo.module';
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
import { FormatDemoComponent } from '../code-examples/layout/format/format-demo.component';
import { FormatDemoModule } from '../code-examples/layout/format/format-demo.module';
import { PageDemoComponent } from '../code-examples/layout/page/layout-fit/page-demo.component';
import { PageDemoModule } from '../code-examples/layout/page/layout-fit/page-demo.module';
import { TextExpandRepeaterDemoComponent } from '../code-examples/layout/text-expand-repeater/text-expand-repeater-demo.component';
import { TextExpandRepeaterDemoModule } from '../code-examples/layout/text-expand-repeater/text-expand-repeater-demo.module';
import { TextExpandDemoComponent } from '../code-examples/layout/text-expand/inline/text-expand-demo.component';
import { TextExpandDemoModule } from '../code-examples/layout/text-expand/inline/text-expand-demo.module';

const routes: Routes = [
  { path: 'back-to-top/grid', component: BackToTopGridDemoComponent },
  {
    path: 'back-to-top/infinite-scroll',
    component: BackToTopInfiniteScrollDemoComponent,
  },
  { path: 'back-to-top/repeater', component: BackToTopRepeaterDemoComponent },
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
  {
    path: 'format',
    component: FormatDemoComponent,
  },
  {
    path: 'page',
    component: PageDemoComponent,
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
    BackToTopGridDemoModule,
    BackToTopInfiniteScrollDemoModule,
    BackToTopRepeaterDemoModule,
    BoxDemoModule,
    InlineHelpBoxDemoModule,
    DescriptionListHorizontalDemoModule,
    DescriptionListLongDescriptionDemoModule,
    DescriptionListVerticalDemoModule,
    DescriptionListInlineHelpDemoModule,
    FormatDemoModule,
    LayoutRoutingModule,
    PageDemoModule,
    TextExpandRepeaterDemoModule,
    TextExpandDemoModule,
  ],
})
export class LayoutModule {}
