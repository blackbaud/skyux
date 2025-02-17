import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { SkyListModule } from '@skyux/list-builder';
import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

import { SkyGridModule } from './lib/modules/list-builder-compat';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyGridModule, SkyListModule, SkyListViewGridModule],
  styles: ``,
  templateUrl: './example-list-builder.component.html',
})
export default class ListViewGridExampleComponent {
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

  protected data$ = toObservable(this.data);
}
