import { Component } from '@angular/core';
import { SkyLabelType } from '@skyux/indicators';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  standalone: false,
})
export class LabelComponent {
  public types: SkyLabelType[] = ['info', 'success', 'warning', 'danger'];
}
