import { Component } from '@angular/core';

@Component({
  selector: 'app-description-list',
  templateUrl: './description-list.component.html',
})
export class DescriptionListComponent {
  /* spell-checker:disable */
  public items: { term: string; description: string; showHelp?: boolean }[] = [
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
      showHelp: true,
    },
    {
      term: 'Class year',
      description: '2024',
    },
  ];
  /* spell-checker:enable */
}
