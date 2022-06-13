import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  SkyAlertModule,
  SkyChevronModule,
  SkyExpansionIndicatorModule,
  SkyHelpInlineModule,
  SkyIconModule,
  SkyKeyInfoModule,
  SkyLabelModule,
  SkyStatusIndicatorModule,
  SkyTextHighlightModule,
  SkyTokensModule,
  SkyWaitModule,
} from '@skyux/indicators';

import { AlertVisualComponent } from './alert/alert-visual.component';
import { SkyChevronDemoComponent } from './chevron/chevron-demo.component';
import { SkyHelpInlineDemoComponent } from './help-inline/help-inline-demo.component';
import { SkyIconStackDemoComponent } from './icon-stack/icon-stack-demo.component';
import { SkyIconDemoComponent } from './icon/icon-demo.component';
import { KeyInfoVisualComponent } from './key-info/key-info-visual.component';
import { SkyLabelDemoComponent } from './label/label-demo.component';
import { StatusIndicatorVisualComponent } from './status-indicator/status-indicator-visual.component';
import { SkyTextHighlightDemoComponent } from './text-highlight/text-highlight-demo.component';
import { SkyTokensDemoComponent } from './tokens/tokens-demo.component';
import { VisualComponent } from './visual.component';
import { SkyWaitDemoComponent } from './wait/wait-demo.component';

@NgModule({
  declarations: [
    AlertVisualComponent,
    SkyChevronDemoComponent,
    SkyHelpInlineDemoComponent,
    SkyIconDemoComponent,
    SkyIconStackDemoComponent,
    KeyInfoVisualComponent,
    VisualComponent,
    SkyLabelDemoComponent,
    StatusIndicatorVisualComponent,
    SkyTextHighlightDemoComponent,
    SkyTokensDemoComponent,
    SkyWaitDemoComponent,
  ],
  exports: [
    AlertVisualComponent,
    SkyChevronDemoComponent,
    SkyHelpInlineDemoComponent,
    SkyIconDemoComponent,
    SkyIconStackDemoComponent,
    KeyInfoVisualComponent,
    VisualComponent,
    SkyLabelDemoComponent,
    StatusIndicatorVisualComponent,
    SkyTextHighlightDemoComponent,
    SkyTokensDemoComponent,
    SkyWaitDemoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SkyAlertModule,
    SkyChevronModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyKeyInfoModule,
    SkyLabelModule,
    SkyStatusIndicatorModule,
    SkyTextHighlightModule,
    SkyTokensModule,
    SkyWaitModule,
    SkyExpansionIndicatorModule,
  ],
})
export class VisualModule {}
