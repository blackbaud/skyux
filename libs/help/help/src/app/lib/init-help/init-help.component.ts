import {
  Component
} from '@angular/core';

import {
  HelpInitializationService
} from '../../public';

@Component({
  selector: 'init-help',
  template: ''
})
export class HelpInitComponent {
  constructor(
    private initService: HelpInitializationService) {
    this.initService.load({ extends: 'bbhelp' });
  }
}
