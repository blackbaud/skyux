import { Component } from '@angular/core';

import { Observable, asyncScheduler, scheduled } from 'rxjs';

import { SkyDescriptionListModeType } from '../types/description-list-mode-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './description-list.component.fixture.html',
})
export class SkyDescriptionListTestComponent {
  public listItemWidth: string;

  public mode: SkyDescriptionListModeType;

  public personalInfo: { term: string; description?: string }[] = [
    {
      term: 'Job title',
      description: 'Engineer',
    },
    {
      term: 'Hobby',
      description: 'Volleyball',
    },
    {
      term: 'Experience',
    },
  ];

  public systemInfo: { term: string; description?: string }[] = [
    {
      term: 'Username',
      description: 'user1',
    },
    {
      term: 'Role',
      description: 'Admin',
    },
    {
      term: 'Last log-in time',
    },
  ];

  public asyncInfo: { term: string; description?: Observable<string> }[] = [
    {
      term: 'First',
      description: scheduled(['Example 1'], asyncScheduler),
    },
    {
      term: 'Second',
      description: scheduled(['Example 2'], asyncScheduler),
    },
    {
      term: 'Third',
      description: scheduled(['Example 3'], asyncScheduler),
    },
  ];
}
