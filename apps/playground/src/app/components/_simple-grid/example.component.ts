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
    <sky-simple-grid [data]="data">
      <sky-simple-grid-column field="firstName" />
      <sky-simple-grid-column field="lastName" />
      <sky-simple-grid-column field="emailAddress" />
    </sky-simple-grid>
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
