import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

import { SkyGridModule } from './lib/modules/simple-grid';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
}

@Component({
  selector: 'app-foo:not([heading])',
  template: `foo`,
})
export class FooComponent {}

@Component({
  selector: 'app-foo[heading]',
  template: `foo with heading`,
})
export class Foo1Component {
  public heading = input.required<string>();
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FooComponent, Foo1Component, SkyGridModule],
  styles: ``,
  template: `
    <app-foo />
    <app-foo heading="foo" />
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
      firstName: 'Michael',
      lastName: 'Scott',
      emailAddress: 'mscott@dundermifflin.com',
    },
    {
      id: 'user2',
      firstName: 'Dwight',
      lastName: 'Schrute',
      emailAddress: 'dschrute@dundermifflin.com',
    },
    {
      id: 'user3',
      firstName: 'Jan',
      lastName: 'Levinson',
      emailAddress: 'jlevinson@dundermifflin.com',
    },
    {
      id: 'user4',
      firstName: 'Mose',
      lastName: 'Schrute',
      emailAddress: 'moseknows@beetfarmers.net',
    },
  ]);
}
