import { Component, Input } from '@angular/core';
import { SkyKeyInfoLayoutType } from '@skyux/indicators';

@Component({
  selector: 'app-summary-action-bar',
  templateUrl: './summary-action-bar.component.html',
  styleUrls: ['./summary-action-bar.component.scss'],
})
export class SummaryActionBarComponent {
  @Input()
  public layout: SkyKeyInfoLayoutType = 'vertical';
}
