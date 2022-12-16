import { Component } from '@angular/core';
import { SkyLabelType } from '@skyux/indicators';

@Component({
  selector: 'app-label-demo',
  templateUrl: './label-demo.component.html',
})
export class LabelDemoComponent {
  public labels: { type: SkyLabelType; content: string }[] = [
    {
      type: 'success',
      content: 'Submitted',
    },
    {
      type: 'info',
      content: 'Not yet submitted',
    },
    {
      type: 'warning',
      content: 'Due soon',
    },
    {
      type: 'danger',
      content: 'Overdue',
    },
  ];
}
