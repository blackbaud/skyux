import {
  Component
} from '@angular/core';

@Component({
  selector: 'sky-tab-summary-action-bar-demo',
  templateUrl: './tab-summary-action-bar-demo.component.html',
  styleUrls: ['./tab-summary-action-bar-demo.component.scss']
})
export class SkyTabSummaryActionBarDemoComponent {

  constructor() { }

  public printHello() {
    console.log('hello');
  }
}
