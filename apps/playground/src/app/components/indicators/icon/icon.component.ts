import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

@Component({
  selector: 'app-icon',
  imports: [SkyIconModule],
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        --sky-icon-color: pink;
      }
    `,
  ],
})
export class IconDemoComponent {}
