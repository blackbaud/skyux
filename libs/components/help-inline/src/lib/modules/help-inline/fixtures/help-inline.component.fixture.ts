import { Component, TemplateRef, ViewChild } from '@angular/core';

import { SkyHelpInlineModule } from '../help-inline.module';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './help-inline.component.fixture.html',
  imports: [SkyHelpInlineModule],
})
export class HelpInlineTestComponent {
  public ariaControls: string | undefined;
  public ariaExpanded: boolean | undefined;
  public ariaLabel: string | undefined;
  public helpKey: string | undefined;
  public labelledBy: string | undefined;
  public labelText: string | undefined;
  public popoverContent: TemplateRef<unknown> | string | undefined;
  public popoverTitle: string | undefined;
  public showHelpText = false;

  @ViewChild('popoverTemplate', { read: TemplateRef })
  public popoverTemplate: TemplateRef<unknown> | undefined;

  public onActionClick(): void {
    this.showHelpText = !this.showHelpText;
  }

  public onClick(): void {
    /* */
  }
}
