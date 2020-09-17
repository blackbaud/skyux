import {
  Component,
  Input
} from '@angular/core';

import {
  SkyLabelType
} from './label-type';

@Component({
  selector: 'sky-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class SkyLabelComponent {

  /**
   * The type of label to display.
   * @required
   */
  @Input()
  public set labelType(value: SkyLabelType) {
    this._labelType = value;
  }

  public get labelType(): SkyLabelType {
    return this._labelType || 'info';
  }

  private _labelType: SkyLabelType;

}
