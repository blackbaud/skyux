import {
  Component
} from '@angular/core';

import {
  SkyDescriptionListMode
} from '../types/description-list-mode';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './description-list.component.fixture.html'
})
export class SkyDescriptionListTestComponent {

  public listItemWidth: string;

  public mode: SkyDescriptionListMode;

  public personalInfo: {term: string, description?: string}[] = [
    {
      term: 'Job title',
      description: 'Engineer'
    },
    {
      term: 'Hobby',
      description: 'Volleyball'
    },
    {
      term: 'Experience'
    }
  ];

  public systemInfo: {term: string, description?: string}[] = [
    {
      term: 'Username',
      description: 'user1'
    },
    {
      term: 'Role',
      description: 'Admin'
    },
    {
      term: 'Last log-in time'
    }
  ];

}
