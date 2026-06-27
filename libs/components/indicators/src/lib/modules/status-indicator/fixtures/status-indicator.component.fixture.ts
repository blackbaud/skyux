import { Component, input } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './status-indicator.component.fixture.html',
  standalone: false,
})
export class StatusIndicatorTestComponent {
  public customDescription = input<string | undefined>(undefined);

  public descriptionType = input<string | undefined>(undefined);

  public indicatorType = input<string | undefined>(undefined);

  public showHelp = input<boolean>(false);
}
