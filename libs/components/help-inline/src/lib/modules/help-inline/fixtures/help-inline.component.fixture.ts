import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './help-inline.component.fixture.html',
})
export class HelpInlineTestComponent {
  public ariaControls: string | undefined;
  public ariaExpanded: boolean | undefined;
  public ariaLabel: string | undefined;
  public showHelpText = false;
  public popoverContent: string | undefined;
  public popoverTitle: string | undefined;
  public labelText: string | undefined;

  public buttonClicked(): void {
    this.showHelpText = !this.showHelpText;
  }
}
