import { Component } from '@angular/core';

import { SkyPageModule } from '../page.module';

@Component({
  selector: 'sky-page-component-fixture',
  standalone: true,
  imports: [SkyPageModule],
  template: `<sky-page-content>Some content</sky-page-content>`,
})
export class PageContentFixtureComponent {}
