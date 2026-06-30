import { Component, signal } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './definition-list.component.fixture.html',
  standalone: false,
})
export class SkyDefinitionListTestComponent {
  public personalInfo = signal<{ label: string; value?: string }[]>([
    {
      label: 'Job title',
      value: 'Engineer',
    },
    {
      label: 'Hobby',
      value: 'Volleyball',
    },
    {
      label: 'Experience',
    },
  ]);

  public systemInfo = signal<{ label: string; value?: string }[]>([
    {
      label: 'Username',
      value: 'user1',
    },
    {
      label: 'Role',
      value: 'Admin',
    },
    {
      label: 'Last log-in time',
    },
  ]);
}
