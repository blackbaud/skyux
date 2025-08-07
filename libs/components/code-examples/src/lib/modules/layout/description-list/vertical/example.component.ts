import { Component } from '@angular/core';
import { SkyDescriptionListModule } from '@skyux/layout';

/**
 * @title Vertical mode
 */
@Component({
  selector: 'app-layout-description-list-vertical-example',
  templateUrl: './example.component.html',
  imports: [SkyDescriptionListModule],
})
export class LayoutDescriptionListVerticalExampleComponent {
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
}
