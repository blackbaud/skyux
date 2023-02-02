import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActionButtonDemoComponent } from '../code-examples/layout/action-button/basic/action-button-demo.component';
import { ActionButtonDemoModule } from '../code-examples/layout/action-button/basic/action-button-demo.module';
import { ActionButtonDemoComponent as ActionButtonPermalinkComponent } from '../code-examples/layout/action-button/permalink/action-button-demo.component';
import { ActionButtonDemoModule as ActionButtonPermalinkModule } from '../code-examples/layout/action-button/permalink/action-button-demo.module';
import { BackToTopDemoComponent as BackToTopInfiniteScrollDemoComponent } from '../code-examples/layout/back-to-top/infinite-scroll/back-to-top-demo.component';
import { BackToTopDemoModule as BackToTopInfiniteScrollDemoModule } from '../code-examples/layout/back-to-top/infinite-scroll/back-to-top-demo.module';
import { BackToTopDemoComponent as BackToTopRepeaterDemoComponent } from '../code-examples/layout/back-to-top/repeater/back-to-top-demo.component';
import { BackToTopDemoModule as BackToTopRepeaterDemoModule } from '../code-examples/layout/back-to-top/repeater/back-to-top-demo.module';
import { BoxDemoComponent } from '../code-examples/layout/box/basic/box-demo.component';
import { BoxDemoModule } from '../code-examples/layout/box/basic/box-demo.module';
import { BoxDemoComponent as InlineHelpBoxDemoComponent } from '../code-examples/layout/box/inline-help/box-demo.component';
import { BoxDemoModule as InlineHelpBoxDemoModule } from '../code-examples/layout/box/inline-help/box-demo.module';
import { CardDemoComponent } from '../code-examples/layout/card/basic/card-demo.component';
import { CardDemoModule } from '../code-examples/layout/card/basic/card-demo.module';
import { DefinitionListDemoComponent } from '../code-examples/layout/definition-list/basic/definition-list-demo.component';
import { DefinitionListDemoModule } from '../code-examples/layout/definition-list/basic/definition-list-demo.module';
import { DescriptionListDemoComponent as DescriptionListHorizontalDemoComponent } from '../code-examples/layout/description-list/horizontal/description-list-demo.component';
import { DescriptionListDemoModule as DescriptionListHorizontalDemoModule } from '../code-examples/layout/description-list/horizontal/description-list-demo.module';
import { DescriptionListDemoComponent as DescriptionListInlineHelpDemoComponent } from '../code-examples/layout/description-list/inline-help/description-list-demo.component';
import { DescriptionListDemoModule as DescriptionListInlineHelpDemoModule } from '../code-examples/layout/description-list/inline-help/description-list-demo.module';
import { DescriptionListDemoComponent as DescriptionListLongDescriptionDemoComponent } from '../code-examples/layout/description-list/long-description/description-list-demo.component';
import { DescriptionListDemoModule as DescriptionListLongDescriptionDemoModule } from '../code-examples/layout/description-list/long-description/description-list-demo.module';
import { DescriptionListDemoComponent as DescriptionListVerticalDemoComponent } from '../code-examples/layout/description-list/vertical/description-list-demo.component';
import { DescriptionListDemoModule as DescriptionListVerticalDemoModule } from '../code-examples/layout/description-list/vertical/description-list-demo.module';
import { FluidGridDemoComponent } from '../code-examples/layout/fluid-grid/fluid-grid-demo.component';
import { FluidGridDemoModule } from '../code-examples/layout/fluid-grid/fluid-grid-demo.module';
import { FormatDemoComponent } from '../code-examples/layout/format/format-demo.component';
import { FormatDemoModule } from '../code-examples/layout/format/format-demo.module';
import { InlineDeleteDemoComponent } from '../code-examples/layout/inline-delete/custom/inline-delete-demo.component';
import { InlineDeleteDemoModule } from '../code-examples/layout/inline-delete/custom/inline-delete-demo.module';
import { InlineDeleteRepeaterDemoComponent } from '../code-examples/layout/inline-delete/repeater/inline-delete-repeater-demo.component';
import { InlineDeleteRepeaterDemoModule } from '../code-examples/layout/inline-delete/repeater/inline-delete-repeater-demo.module';
import { PageSummaryDemoComponent } from '../code-examples/layout/page-summary/basic/page-summary-demo.component';
import { PageSummaryDemoModule } from '../code-examples/layout/page-summary/basic/page-summary-demo.module';
import { PageDemoComponent } from '../code-examples/layout/page/layout-fit/page-demo.component';
import { PageDemoModule } from '../code-examples/layout/page/layout-fit/page-demo.module';
import { TextExpandRepeaterDemoComponent } from '../code-examples/layout/text-expand-repeater/text-expand-repeater-demo.component';
import { TextExpandRepeaterDemoModule } from '../code-examples/layout/text-expand-repeater/text-expand-repeater-demo.module';
import { TextExpandDemoComponent } from '../code-examples/layout/text-expand/inline/text-expand-demo.component';
import { TextExpandDemoModule } from '../code-examples/layout/text-expand/inline/text-expand-demo.module';
import { TextExpandDemoComponent as TextExpandModalComponent } from '../code-examples/layout/text-expand/modal/text-expand-demo.component';
import { TextExpandDemoModule as TextExpandModalModule } from '../code-examples/layout/text-expand/modal/text-expand-demo.module';
import { TextExpandDemoComponent as TextExpandNewlineComponent } from '../code-examples/layout/text-expand/newline/text-expand-demo.component';
import { TextExpandDemoModule as TextExpandNewlineModule } from '../code-examples/layout/text-expand/newline/text-expand-demo.module';
import { ToolbarDemoComponent } from '../code-examples/layout/toolbar/basic/toolbar-demo.component';
import { ToolbarDemoModule } from '../code-examples/layout/toolbar/basic/toolbar-demo.module';
import { ToolbarDemoComponent as ToolbarSectionedComponent } from '../code-examples/layout/toolbar/sectioned/toolbar-demo.component';
import { ToolbarDemoModule as ToolbarSectionedModule } from '../code-examples/layout/toolbar/sectioned/toolbar-demo.module';

const routes: Routes = [
  {
    path: 'action-button/basic',
    component: ActionButtonDemoComponent,
  },
  {
    path: 'action-button/permalink',
    component: ActionButtonPermalinkComponent,
  },
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
    path: 'card/basic',
    component: CardDemoComponent,
  },
  {
    path: 'definition-list/basic',
    component: DefinitionListDemoComponent,
  },
  {
    path: 'description-list/horizontal',
    component: DescriptionListHorizontalDemoComponent,
  },
  {
    path: 'description-list/inline-help',
    component: DescriptionListInlineHelpDemoComponent,
  },
  {
    path: 'description-list/vertical',
    component: DescriptionListVerticalDemoComponent,
  },
  {
    path: 'description-list/long-description',
    component: DescriptionListLongDescriptionDemoComponent,
  },
  {
    path: 'fluid-grid',
    component: FluidGridDemoComponent,
  },
  {
    path: 'format',
    component: FormatDemoComponent,
  },
  {
    path: 'inline-delete/custom',
    component: InlineDeleteDemoComponent,
  },
  {
    path: 'inline-delete/repeater',
    component: InlineDeleteRepeaterDemoComponent,
  },
  {
    path: 'page',
    component: PageDemoComponent,
  },
  {
    path: 'page-summary/basic',
    component: PageSummaryDemoComponent,
  },
  {
    path: 'text-expand/inline',
    component: TextExpandDemoComponent,
  },
  {
    path: 'text-expand/modal',
    component: TextExpandModalComponent,
  },
  {
    path: 'text-expand/newline',
    component: TextExpandNewlineComponent,
  },
  {
    path: 'text-expand-repeater',
    component: TextExpandRepeaterDemoComponent,
  },
  {
    path: 'toolbar/basic',
    component: ToolbarDemoComponent,
  },
  {
    path: 'toolbar/sectioned',
    component: ToolbarSectionedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}

@NgModule({
  imports: [
    BackToTopInfiniteScrollDemoModule,
    BackToTopRepeaterDemoModule,
    BoxDemoModule,
    InlineHelpBoxDemoModule,
    DescriptionListInlineHelpDemoModule,
    DescriptionListHorizontalDemoModule,
    FormatDemoModule,
    LayoutRoutingModule,
    PageDemoModule,
    TextExpandRepeaterDemoModule,
    TextExpandDemoModule,
    ActionButtonDemoModule,
    ActionButtonPermalinkModule,
    CardDemoModule,
    DefinitionListDemoModule,
    DescriptionListVerticalDemoModule,
    DescriptionListLongDescriptionDemoModule,
    FluidGridDemoModule,
    InlineDeleteDemoModule,
    InlineDeleteRepeaterDemoModule,
    PageSummaryDemoModule,
    TextExpandModalModule,
    TextExpandNewlineModule,
    ToolbarDemoModule,
    ToolbarSectionedModule,
  ],
})
export class LayoutModule {}
