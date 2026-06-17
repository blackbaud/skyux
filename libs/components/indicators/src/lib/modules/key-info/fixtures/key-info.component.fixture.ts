import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkyKeyInfoLayoutType } from '../key-info-layout-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './key-info.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class KeyInfoTestComponent {
  public helpContent: string | undefined = undefined;
  public layout: SkyKeyInfoLayoutType | undefined = 'vertical';
}
