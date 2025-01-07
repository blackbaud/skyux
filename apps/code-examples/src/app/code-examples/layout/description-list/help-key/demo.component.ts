import { Component } from '@angular/core';
import { SkyDescriptionListModule } from '@skyux/layout';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyDescriptionListModule],
})
export class DemoComponent {
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
