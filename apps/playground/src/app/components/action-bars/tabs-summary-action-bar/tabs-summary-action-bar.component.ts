import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs-summary-action-bar',
  templateUrl: './tabs-summary-action-bar.component.html',
  styleUrls: ['./tabs-summary-action-bar.component.scss'],
  standalone: false,
})
export class TabsSummaryActionBarComponent {
  public printHello(): void {
    console.log('hello');
  }
}
