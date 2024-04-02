import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './help-inline.component.fixture.html',
})
export class HelpInlineTestComponent {
  public ariaControls: string | undefined;
  public ariaExpanded: boolean | undefined;
  public ariaLabel: string | undefined;
  public showHelpText = false;
  public popoverContent: TemplateRef<unknown> | string | undefined;
  public popoverTitle: string | undefined;
  public labelText: string | undefined;

  @ViewChild('popoverTemplate', { read: TemplateRef })
  public popoverTemplate: TemplateRef<unknown> | undefined;

  public buttonClicked(): void {
    this.showHelpText = !this.showHelpText;
  }
}
