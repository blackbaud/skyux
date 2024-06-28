import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';

import { SkyHelpInlineModule } from '../help-inline.module';

@Component({
  selector: 'sky-test-cmp',
  standalone: true,
  templateUrl: './help-inline.component.fixture.html',
  imports: [CommonModule, SkyHelpInlineModule],
})
export class HelpInlineTestComponent {
  public ariaControls: string | undefined;
  public ariaExpanded: boolean | undefined;
  public ariaLabel: string | undefined;
  public showHelpText = false;
  public popoverContent: TemplateRef<unknown> | string | undefined;
  public popoverTitle: string | undefined;
  public labelText: string | undefined;
  public labelledBy: string | undefined;
  public helpKey: string | undefined;

  @ViewChild('popoverTemplate', { read: TemplateRef })
  public popoverTemplate: TemplateRef<unknown> | undefined;

  public onActionClick(): void {
    this.showHelpText = !this.showHelpText;
  }

  public onClick(): void {
    /* */
  }
}
