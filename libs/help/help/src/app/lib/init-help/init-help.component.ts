import {
  Component
} from '@angular/core';

import {
  HelpInitializationService
} from '../../public/public_api';

@Component({
  selector: 'init-help',
  template: ''
})
export class HelpInitComponent {
  public constructor(private initService: HelpInitializationService) {
    this.initService.load({extends: 'bbhelp'});
  }
}
