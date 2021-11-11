import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './status-indicator.component.fixture.html',
})
export class StatusIndicatorTestComponent {
  public customDescription: string;

  public descriptionType: string;

  public indicatorType: string;
}
