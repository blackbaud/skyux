import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  SkyGridModule,
  SkyGridSelectedRowsModelChange,
} from './lib/modules/drop-in';

// import { SkyGridModule, SkyGridSelectedRowsModelChange } from '@skyux/grids';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyGridModule, JsonPipe],
  styles: ``,
  template: `@if (data(); as data) {
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
      <strong>{{ value }}</strong>
      {{ row | json }}
    </ng-template>
  }`,
})
export default class GridDropInExampleComponent {
  protected data = signal<User[] | undefined>([
    {
      id: 'a1',
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john.doe@foo.com',
    },
    {
      id: 'a2',
      firstName: 'Mary',
      lastName: 'Sue',
      emailAddress: 'mary.sue@bar.net',
    },
  ]);

  protected onMultiselectSelectionChange(
    evt: SkyGridSelectedRowsModelChange,
  ): void {
    console.log('multiselect change', evt);
  }
}
