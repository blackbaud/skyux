import { Component } from '@angular/core';
import { SkyKeyInfoLayoutType } from '@skyux/indicators';

@Component({
  selector: 'app-key-info',
  templateUrl: './key-info.component.html',
  styleUrls: ['./key-info.component.scss'],
  standalone: false,
})
export class KeyInfoComponent {
  protected readonly helpEnabled = [false, true];
  protected readonly layouts: SkyKeyInfoLayoutType[] = [
    'vertical',
    'horizontal',
  ];
}
