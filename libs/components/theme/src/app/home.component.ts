import {
  Component
} from '@angular/core';

import {
  SkyAppStyleLoader
} from './public';

@Component({
  selector: 'app-home',
  template: 'asdf'
})
export class HomeComponent {
  constructor(
    private styleLoader: SkyAppStyleLoader
  ) {
    this.styleLoader.loadStyles().then(() => {
      console.log('Styles loaded.');
    }).catch((err: any) => {
      console.log('Error loading styles:', err);
    });
  }
}
