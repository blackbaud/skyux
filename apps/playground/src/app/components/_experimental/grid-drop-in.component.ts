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
  templateUrl: './grid-drop-in.component.html',
})
export default class GridDropInComponent {
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
