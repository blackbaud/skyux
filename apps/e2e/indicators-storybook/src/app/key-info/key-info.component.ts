import { Component } from '@angular/core';
import { SkyKeyInfoLayoutType, SkyKeyInfoModule } from '@skyux/indicators';

@Component({
  imports: [SkyKeyInfoModule],
  selector: 'app-key-info',
  templateUrl: './key-info.component.html',
  styleUrl: './key-info.component.scss',
})
export class KeyInfoComponent {
  protected readonly helpEnabled = [false, true];
  protected readonly layouts: SkyKeyInfoLayoutType[] = [
    'vertical',
    'horizontal',
  ];
}
