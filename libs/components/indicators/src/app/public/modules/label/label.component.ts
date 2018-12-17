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
  @Input()
  public set labelType(value: string) {
    this._labelType = value;
  }

  public get labelType(): string {
    return this._labelType || 'info';
  }

  private _labelType: string;
}
