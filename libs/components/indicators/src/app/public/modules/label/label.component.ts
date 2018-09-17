import { Component, Input } from '@angular/core';

@Component({
  selector: 'sky-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class SkyLabelComponent {
  @Input()
  public labelType: string;
}
