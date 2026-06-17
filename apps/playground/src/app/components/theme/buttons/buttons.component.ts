import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

@Component({
  selector: 'app-buttons',
  imports: [SkyIconModule],
  templateUrl: './buttons.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./buttons.component.scss'],
})
export class ButtonsComponent {}
