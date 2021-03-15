import {
  Component
} from '@angular/core';

import {
  SkyAppConfigHost,
  SkyAppRuntimeConfigParamsProvider
} from '@skyux/config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {

  constructor(
    hostConfig: SkyAppConfigHost,
    paramsProvider: SkyAppRuntimeConfigParamsProvider
  ) {
    console.log('Host config:', hostConfig.host);
    console.log('Params:', paramsProvider.params.getAll(true));
  }

}
