import { Component, booleanAttribute, input } from '@angular/core';

// #region Test component
@Component({
  selector: 'sky-box-fixture',
  templateUrl: './box-harness-test.component.html',
  standalone: false,
})
export class BoxHarnessTestComponent {
  public ariaRole = input<string | undefined>(undefined);
  public ariaLabel = input<string | undefined>(undefined);
  public ariaLabelledBy = input<string | undefined>(undefined);
  public headingText = input<string | undefined>(undefined);
  public headingHidden = input(false);
  public headingLevel = input<number | undefined>(undefined);
  public headingStyle = input<number | undefined>(undefined);
  public helpKey = input<string | undefined>(undefined);
  public helpPopoverContent = input<string | undefined>(undefined);
  public helpPopoverTitle = input<string | undefined>(undefined);
  public otherBox = 'otherBox';

  public showControls = input(false, { transform: booleanAttribute });
}
// #endregion Test component
