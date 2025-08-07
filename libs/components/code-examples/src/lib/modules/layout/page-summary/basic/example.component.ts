import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyCheckboxModule } from '@skyux/forms';
import {
  SkyAlertModule,
  SkyKeyInfoModule,
  SkyLabelModule,
} from '@skyux/indicators';
import { SkyPageSummaryModule } from '@skyux/layout';

/**
 * @title Page summary with basic setup
 */
@Component({
  selector: 'app-layout-page-summary-basic-example',
  templateUrl: './example.component.html',
  imports: [
    FormsModule,
    SkyAlertModule,
    SkyAvatarModule,
    SkyCheckboxModule,
    SkyKeyInfoModule,
    SkyLabelModule,
    SkyPageSummaryModule,
  ],
})
export class LayoutPageSummaryBasicExampleComponent {
  protected name = 'Robert C. Hernandez';
  protected showAlert = true;
  protected showContent = true;
  protected showImage = true;
  protected showKeyInfo = true;
  protected showStatus = true;
  protected showSubtitle = true;
  protected showTitle = true;
}
