import { Component, booleanAttribute, input } from '@angular/core';

// #region Test component
@Component({
  selector: 'sky-box-fixture',
  templateUrl: './box-harness-test.component.html',
  standalone: false,
})
export class BoxHarnessTestComponent {
  public ariaRole: string | undefined;
  public ariaLabel: string | undefined;
  public ariaLabelledBy: string | undefined;
  public headingText: string | undefined;
  public headingHidden = false;
  public headingLevel: number | undefined;
  public headingStyle: number | undefined;
  public helpKey: string | undefined;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
  public otherBox = 'otherBox';

  public showControls = input(false, { transform: booleanAttribute });
}
// #endregion Test component
