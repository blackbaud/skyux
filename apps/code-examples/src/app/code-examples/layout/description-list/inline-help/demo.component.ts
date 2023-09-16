import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyDescriptionListModule } from '@skyux/layout';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [CommonModule, SkyDescriptionListModule, SkyHelpInlineModule],
})
export class DemoComponent {
  protected items: { term: string; description: string }[] = [
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
