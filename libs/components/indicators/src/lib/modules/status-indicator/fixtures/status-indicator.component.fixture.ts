import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './status-indicator.component.fixture.html',
  standalone: false,
})
export class StatusIndicatorTestComponent {
  public customDescription: string | undefined;

  public descriptionType: string | undefined;

  public indicatorType: string | undefined;

  public showHelp = false;
}
