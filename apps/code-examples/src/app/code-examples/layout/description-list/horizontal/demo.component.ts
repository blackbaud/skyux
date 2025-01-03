import { Component } from '@angular/core';
import { SkyDescriptionListModule } from '@skyux/layout';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyDescriptionListModule],
})
export class DemoComponent {
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
