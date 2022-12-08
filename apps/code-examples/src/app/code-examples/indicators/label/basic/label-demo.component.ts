import { Component, Input } from '@angular/core';
import { SkyIndicatorDescriptionType, SkyLabelType } from '@skyux/indicators';

@Component({
  selector: 'app-label-demo',
  templateUrl: './label-demo.component.html',
})
export class LabelDemoComponent {
  @Input()
  public get daysUntilDue(): number {
    return this.#_daysUntilDue;
  }

  public set daysUntilDue(days: number) {
    this.#_daysUntilDue = days;
    this.updateLabelProperties(this.submitted, days);
  }

  @Input()
  public get submitted(): boolean {
    return this.#_submitted;
  }

  public set submitted(submitted: boolean) {
    this.#_submitted = submitted;
    this.updateLabelProperties(submitted, this.daysUntilDue);
  }

  public labelType: SkyLabelType = 'info';
  public descriptionType: SkyIndicatorDescriptionType = 'attention';
  public labelText = 'Incomplete';
  public todaysDate = new Date('9/14/22');
  #_daysUntilDue = 14;
  #_submitted = false;

  private updateLabelProperties(submitted: boolean, days: number): void {
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
