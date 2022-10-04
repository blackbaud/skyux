import { Component } from '@angular/core';

import { SkyKeyInfoLayoutType } from '../key-info-layout-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './key-info.component.fixture.html',
})
export class KeyInfoTestComponent {
  public layout: SkyKeyInfoLayoutType | undefined = 'vertical';
}
