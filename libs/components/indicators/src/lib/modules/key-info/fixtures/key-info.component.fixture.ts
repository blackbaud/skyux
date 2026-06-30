import { Component, input } from '@angular/core';

import { SkyKeyInfoLayoutType } from '../key-info-layout-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './key-info.component.fixture.html',
  standalone: false,
})
export class KeyInfoTestComponent {
  public helpContent = input<string | undefined>(undefined);
  public layout = input<SkyKeyInfoLayoutType | undefined>('vertical');
}
