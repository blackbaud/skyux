import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { SkyGridSelectedRowsModelChange } from './lib/simple-grid.component';
import { SkySimpleGridModule } from './lib/simple-grid.module';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkySimpleGridModule],
  styles: ``,
  template: `@if (data(); as data) {
    <sky-grid
      [data]="data"
      [enableMultiselect]="true"
      (multiselectSelectionChange)="onMultiselectSelectionChange($event)"
    >
      <sky-grid-column field="firstName" />
      <sky-grid-column field="lastName" />
      <sky-grid-column field="emailAddress" />
    </sky-grid>
  }`,
})
export default class SimpleGridExampleComponent {
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
