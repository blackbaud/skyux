import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <sky-preview-wrapper theme="modern-light">
      <router-outlet></router-outlet>
    </sky-preview-wrapper>
  `,
})
export class AppComponent {}
