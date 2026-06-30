import { Component, TemplateRef, ViewChild, input } from '@angular/core';

import { SkyHelpInlineModule } from '../help-inline.module';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './help-inline.component.fixture.html',
  imports: [SkyHelpInlineModule],
})
export class HelpInlineTestComponent {
  public ariaControls = input<string | undefined>(undefined);
  public ariaExpanded = input<boolean | undefined>(undefined);
  public ariaLabel = input<string | undefined>(undefined);
  public helpKey = input<string | undefined>(undefined);
  public labelledBy = input<string | undefined>(undefined);
  public labelText = input<string | undefined>(undefined);
  public popoverContent = input<TemplateRef<unknown> | string | undefined>(
    undefined,
  );
  public popoverTitle = input<string | undefined>(undefined);
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
