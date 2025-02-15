import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { SkyGridModule } from './lib/modules/simple-grid';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyGridModule],
  styles: ``,
  template: `
    @if (data(); as data) {
      <sky-grid [data]="data">
        <sky-grid-column field="firstName" headingText="First name" />
        <sky-grid-column field="lastName" headingText="Last name" />
        <sky-grid-column
          field="emailAddress"
          headingText="Email address"
          [templateRef]="templateRef"
        />
      </sky-grid>
    }

    <ng-template #templateRef let-value="value" let-row="row">
      <a [href]="'mailto:' + value">{{ value }}</a>
    </ng-template>
  `,
})
export default class SimpleGridExampleComponent {
  protected data = signal<User[] | undefined>([
    {
      id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john.doe@foo.com',
    },
    {
      id: 'user2',
      firstName: 'Mary',
      lastName: 'Sue',
      emailAddress: 'mary.sue@bar.net',
    },
  ]);
}
