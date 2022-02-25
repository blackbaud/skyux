import { Component } from '@angular/core';

@Component({
  selector: 'app-page-summary-demo',
  templateUrl: './page-summary-demo.component.html',
})
export class PageSummaryDemoComponent {
  public name = 'Robert C. Hernandez';

  public showAlert = true;

  public showContent = true;

  public showImage = true;

  public showKeyInfo = true;

  public showStatus = true;

  public showSubtitle = true;

  public showTitle = true;
}
