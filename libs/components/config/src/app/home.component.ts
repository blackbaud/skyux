import {
  Component
} from '@angular/core';

import {
  SkyAppConfigHost,
  SkyAppRuntimeConfigParamsProvider
} from './public/public_api';

@Component({
  selector: 'app-home',
  template: `Home works!`
})
export class HomeComponent {

  constructor(
    hostConfig: SkyAppConfigHost,
    paramsProvider: SkyAppRuntimeConfigParamsProvider
  ) {
    console.log('Runtime params:', paramsProvider.params.getAll(true));
    console.log('Host config:', hostConfig.host);
  }

}
