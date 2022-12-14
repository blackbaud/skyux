import { Component } from '@angular/core';
import { SkyKeyInfoLayoutType } from '@skyux/indicators';

@Component({
  selector: 'app-key-info',
  templateUrl: './key-info.component.html',
  styleUrls: ['./key-info.component.scss'],
})
export class KeyInfoComponent {
  public layouts: SkyKeyInfoLayoutType[] = ['vertical', 'horizontal'];
}
