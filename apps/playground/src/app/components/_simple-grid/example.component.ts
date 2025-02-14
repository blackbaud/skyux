import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { SkySimpleGridModule } from './lib/simple-grid.module';

interface User {
  firstName: string;
  lastName: string;
  emailAddress: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkySimpleGridModule],
  styles: ``,
  template: `@if (data(); as data) {
    <sky-grid enableMultiselect [data]="data">
      <sky-grid-column field="firstName" />
      <sky-grid-column field="lastName" />
      <sky-grid-column field="emailAddress" />
    </sky-grid>
  }`,
})
export default class SimpleGridExampleComponent {
  protected data = signal<User[] | undefined>([
    {
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john.doe@foo.com',
    },
  ]);
}
