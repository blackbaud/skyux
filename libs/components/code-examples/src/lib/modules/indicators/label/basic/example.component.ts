import { Component, Input } from '@angular/core';
import {
  SkyIndicatorDescriptionType,
  SkyLabelModule,
  SkyLabelType,
} from '@skyux/indicators';

/**
 * @title Label with basic setup
 */
@Component({
  selector: 'app-indicators-label-basic-example',
  templateUrl: './example.component.html',
  imports: [SkyLabelModule],
})
export class IndicatorsLabelBasicExampleComponent {
  @Input()
  public get daysUntilDue(): number {
    return this.#_daysUntilDue;
  }

  public set daysUntilDue(days: number) {
    this.#_daysUntilDue = days;
    this.#updateLabelProperties(this.submitted, days);
  }

  @Input()
  public get submitted(): boolean {
    return this.#_submitted;
  }

  public set submitted(submitted: boolean) {
    this.#_submitted = submitted;
    this.#updateLabelProperties(submitted, this.daysUntilDue);
  }

  protected descriptionType: SkyIndicatorDescriptionType = 'attention';
  protected labelText = 'Incomplete';
  protected labelType: SkyLabelType = 'info';

  #_daysUntilDue = 14;
  #_submitted = false;

  #updateLabelProperties(submitted: boolean, days: number): void {
    if (submitted) {
      this.labelType = 'success';
      this.descriptionType = 'completed';
      this.labelText = 'Submitted';
    } else if (days <= 0) {
      this.labelType = 'danger';
      this.descriptionType = 'danger';
      this.labelText = 'Overdue';
    } else if (days <= 7) {
      this.labelType = 'warning';
      this.descriptionType = 'important-warning';
      this.labelText = 'Due soon';
    } else {
      this.labelType = 'info';
      this.descriptionType = 'attention';
      this.labelText = 'Incomplete';
    }
  }
}
