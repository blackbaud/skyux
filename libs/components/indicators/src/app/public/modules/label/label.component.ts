import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class SkyLabelComponent {

  /**
   * The type of label to display. Possible values are `info`, `success`, `warning` and `danger`.
   * @required
   */
  @Input()
  public set labelType(value: string) {
    this._labelType = value;
  }

  public get labelType(): string {
    return this._labelType || 'info';
  }

  private _labelType: string;
}
