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
    <sky-grid-grid [data]="data">
      <sky-grid-grid-column field="firstName" />
      <sky-grid-grid-column field="lastName" />
      <sky-grid-grid-column field="emailAddress" />
    </sky-grid-grid>
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
