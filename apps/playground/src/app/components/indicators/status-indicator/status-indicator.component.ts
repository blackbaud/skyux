import { Component } from '@angular/core';

@Component({
  selector: 'app-status-indicator',
  templateUrl: './status-indicator.component.html',
  standalone: false,
})
export class StatusIndicatorComponent {
  public indicatorText = 'Indicator text A';

  #previousIndicatorText = 'Indicator text B';

  public swapIndicatorText(): void {
    const currentIndicatorText = this.indicatorText;
    this.indicatorText = this.#previousIndicatorText;
    this.#previousIndicatorText = currentIndicatorText;
  }
}
