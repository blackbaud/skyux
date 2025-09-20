import { Component } from '@angular/core';
import { SkyDescriptionListModule } from '@skyux/layout';

/**
 * @title Description list with help key
 */
@Component({
  selector: 'app-layout-description-list-help-key-example',
  templateUrl: './example.component.html',
  imports: [SkyDescriptionListModule],
})
export class LayoutDescriptionListHelpKeyExampleComponent {
  protected items: { term: string; description: string; helpKey?: string }[] = [
    {
      term: 'College',
      description: 'Humanities and Social Sciences',
      helpKey: 'college-help',
    },
    {
      term: 'Department',
      description: 'Anthropology',
    },
    {
      term: 'Advisor',
      description: 'Cathy Green',
    },
    {
      term: 'Class year',
      description: '2024',
    },
  ];
}
