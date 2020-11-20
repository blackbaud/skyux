import {
  Component
} from '@angular/core';

import {
  SkyAppRuntimeConfigParamsProvider
} from './public/public_api';

@Component({
  selector: 'app-home',
  template: `Home works!`
})
export class HomeComponent {

  constructor(
    paramsProvider: SkyAppRuntimeConfigParamsProvider
  ) {
    console.log('Runtime params:', paramsProvider.params);
  }

}
