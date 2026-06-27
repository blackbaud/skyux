import { Component, booleanAttribute, input, signal } from '@angular/core';

// #region Test component
@Component({
  selector: 'sky-box-fixture',
  templateUrl: './box-harness-test.component.html',
  standalone: false,
})
export class BoxHarnessTestComponent {
  public ariaRole = signal<string | undefined>(undefined);
  public ariaLabel = signal<string | undefined>(undefined);
  public ariaLabelledBy = signal<string | undefined>(undefined);
  public headingText = signal<string | undefined>(undefined);
  public headingHidden = signal(false);
  public headingLevel = signal<number | undefined>(undefined);
  public headingStyle = signal<number | undefined>(undefined);
  public helpKey = signal<string | undefined>(undefined);
  public helpPopoverContent = signal<string | undefined>(undefined);
  public helpPopoverTitle = signal<string | undefined>(undefined);
  public otherBox = 'otherBox';

  public showControls = input(false, { transform: booleanAttribute });
}
// #endregion Test component
