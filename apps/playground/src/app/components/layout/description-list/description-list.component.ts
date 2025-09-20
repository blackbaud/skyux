import { Component } from '@angular/core';

@Component({
  selector: 'app-description-list',
  templateUrl: './description-list.component.html',
  standalone: false,
})
export class DescriptionListComponent {
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
      description: 'Cathy Green',
      showHelp: true,
    },
    {
      term: 'Class year',
      description: '2024',
    },
  ];

  public showHelp = false;

  public toggleHelp(): void {
    this.showHelp = !this.showHelp;
  }
}
