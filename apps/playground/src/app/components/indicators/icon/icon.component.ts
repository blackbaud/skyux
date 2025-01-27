import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyAlertModule } from '@skyux/indicators';

@Component({
  selector: 'app-icon',
  imports: [SkyIconModule, SkyAlertModule],
  templateUrl: './icon.component.html',
  styles: [
    `
      :host {
        --sky-icon-color: pink;
      }
    `,
  ],
})
export class IconDemoComponent {}
