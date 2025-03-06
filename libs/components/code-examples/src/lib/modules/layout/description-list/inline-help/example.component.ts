import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyDescriptionListModule } from '@skyux/layout';

/**
 * @title Description list with inline help
 */
@Component({
  selector: 'app-layout-description-list-inline-help-example',
  templateUrl: './example.component.html',
  imports: [SkyDescriptionListModule, SkyHelpInlineModule],
})
export class LayoutDescriptionListInlineHelpExampleComponent {
  protected items: { term: string; description: string; helpText?: string }[] =
    [
      {
        term: 'College',
        description: 'Humanities and Social Sciences',
      },
      {
        term: 'Department',
        description: 'Anthropology',
      },
      {
        term: 'Advisor',
        description: 'Cathy Green',
        helpText: 'The faculty member who advises the student.',
      },
      {
        term: 'Class year',
        description: '2024',
      },
    ];

  protected onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
