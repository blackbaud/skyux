import { Component } from '@angular/core';

@Component({
  selector: 'app-description-list-demo',
  templateUrl: './description-list-demo.component.html',
})
export class DescriptionListDemoComponent {
  public items: { term: string; description: string }[] = [
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
      description: 'Calandra Geer',
    },
    {
      term: 'Class year',
      description: '2024',
    },
  ];
}
