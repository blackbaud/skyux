import { Component } from '@angular/core';

@Component({
  selector: 'definition-list-visual',
  templateUrl: './definition-list-visual.component.html'
})
export class DefinitionListVisualComponent {
  public personalInfo: {label: string, value?: string}[] = [
    {
      label: 'Job title',
      value: 'Engineer'
    },
    {
      label: 'Hobby',
      value: 'Volleyball'
    },
    {
      label: 'Experience'
    }
  ];

  public systemInfo: {label: string, value?: string}[] = [
    {
      label: 'Username',
      value: 'user1'
    },
    {
      label: 'Role',
      value: 'Admin'
    },
    {
      label: 'Last log-in time'
    }
  ];
}
