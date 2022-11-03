import { Component } from '@angular/core';
import { SkyKeyInfoLayoutType } from '@skyux/indicators';

@Component({
  selector: 'app-key-info-demo',
  templateUrl: './key-info-demo.component.html',
})
export class KeyInfoDemoComponent {
  public layout: SkyKeyInfoLayoutType = 'vertical';
}
