import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs-summary-action-bar',
  templateUrl: './tabs-summary-action-bar.component.html',
  styleUrls: ['./tabs-summary-action-bar.component.scss'],
})
export class TabsSummaryActionBarComponent {
  public printHello() {
    console.log('hello');
  }
}
