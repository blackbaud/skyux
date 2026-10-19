import { Component } from '@angular/core';

import { SkyInputBoxButton } from '../input-box-button';

@Component({
  selector: 'sky-input-box-button-outside-input-box-fixture',
  imports: [SkyInputBoxButton],
  template: `<sky-input-box-button iconName="search" labelText="Search" />`,
})
export class InputBoxButtonOutsideInputBoxFixture {}
