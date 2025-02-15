import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  SkyGridModule,
  type SkyGridSelectedRowsModelChange,
} from '@skyux/grids';

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
      <sky-grid
        [data]="data"
        [enableMultiselect]="true"
        (multiselectSelectionChange)="onMultiselectSelectionChange($event)"
      >
        <sky-grid-column field="firstName" heading="First name" />
        <sky-grid-column field="lastName" heading="Last name" />
        <sky-grid-column
          field="emailAddress"
          heading="Email address"
          [template]="foobar"
        />
      </sky-grid>

      <ng-template #foobar let-value="value" let-row="row">
        <a [href]="'mailto:' + value">{{ value }}</a>
      </ng-template>
    }
  `,
})
export default class GridDropInExampleComponent {
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

  protected onMultiselectSelectionChange(
    evt: SkyGridSelectedRowsModelChange,
  ): void {
    console.log('multiselect change', evt);
  }
}
