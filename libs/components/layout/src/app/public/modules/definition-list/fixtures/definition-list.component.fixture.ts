import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './definition-list.component.fixture.html'
})
export class SkyDefinitionListTestComponent {
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
