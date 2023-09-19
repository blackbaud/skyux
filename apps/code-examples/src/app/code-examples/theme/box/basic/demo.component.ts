import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-demo',
  template: `
    <div
      class="sky-box sky-elevation-1-bordered"
      style="width: 50%; height: 250px"
    ></div>

    <div
      class="sky-box sky-elevation-0-bordered"
      style="width: 50%; height: 250px"
    ></div>
  `,
})
export class DemoComponent {}
